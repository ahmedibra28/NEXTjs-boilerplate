import {
  encryptPassword,
  getErrorResponse,
  getResetPasswordToken,
} from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import axios from 'axios'
import DeviceDetector from 'device-detector-js'
import { handleEmailFire } from '@/lib/email-helper'
import { render } from '@react-email/render'
import VerifyAccount from '@/emails/VerifyAccount'
import { roles } from '@/config/data'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    const user =
      email &&
      (await prisma.user.findFirst({
        where: { email: email.toLowerCase(), confirmed: true },
      }))
    if (user) return getErrorResponse('User already exists', 409)

    const reset = await getResetPasswordToken(4320)

    const roleId = roles.find((item) => item.type === 'AUTHENTICATED')?.id

    await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        confirmed: false,
        blocked: false,
        roleId: `${roleId}`,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${name}&background=random&color=random&size=128`,
        password: await encryptPassword({ password }),
        resetPasswordToken: reset.resetPasswordToken,
        resetPasswordExpire: reset.resetPasswordExpire,
      },
    })

    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(
      req.headers.get('user-agent') || ''
    ) as any

    const {
      client: { name: clientName },
      os: { name: osName },
    } = device

    const {
      data: { ip },
    } = await axios.get('https://api.ipify.org/?format=json')

    const result = await handleEmailFire({
      to: email,
      subject: 'Verify your email',
      html: render(
        VerifyAccount({
          clientName,
          osName,
          token: reset.resetToken,
          company: 'Ahmed Ibra',
          ip,
        })
      ),
    })

    if (result)
      return NextResponse.json({
        message: `An email has been sent to ${email} with further instructions to verify your account.`,
      })

    return getErrorResponse('Something went wrong', 500)
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
