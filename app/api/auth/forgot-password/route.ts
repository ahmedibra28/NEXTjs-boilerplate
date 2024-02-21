import DeviceDetector from 'device-detector-js'
import { NextResponse } from 'next/server'
import { getErrorResponse, getResetPasswordToken } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'
import { render } from '@react-email/render'
import { handleEmailFire } from '@/lib/email-helper'
import ResetPassword from '@/emails/ResetPassword'
import axios from 'axios'

export async function POST(req: NextApiRequestExtended) {
  try {
    const { email } = await req.json()

    if (!email) return getErrorResponse('Please enter your email', 400)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user)
      return getErrorResponse(`There is no user with email ${email}`, 404)

    const reset = await getResetPasswordToken()

    await prisma.user.update({
      where: { id: user.id },
      data: {
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
      subject: 'Reset Password Request',
      html: render(
        ResetPassword({
          clientName,
          osName,
          token: reset.resetToken,
          company: 'Book Driving',
          ip,
        })
      ),
    })

    if (result)
      return NextResponse.json({
        message: `An email has been sent to ${email} with further instructions.`,
      })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
