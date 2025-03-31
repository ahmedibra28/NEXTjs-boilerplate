import {
  encryptPassword,
  getErrorResponse,
  getResetPasswordToken,
} from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'
import { handleEmailFire } from '@/lib/email-helper'
import { render } from '@react-email/render'
import VerifyAccount from '@/emails/VerifyAccount'
import { roles } from '@/config/data'
import { getDevice } from '@/lib/getDevice'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    const user =
      email &&
      (await prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      }))
    if (user) {
      if (user.status === 'INACTIVE')
        return getErrorResponse('User is inactive', 403)

      if (user.status === 'ACTIVE')
        return getErrorResponse('User is already active', 409)
    }

    const reset = await getResetPasswordToken(4320)

    const roleId = roles.find((item) => item.type === 'AUTHENTICATED')?.id

    await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      create: {
        name,
        email: email.toLowerCase(),
        status: 'PENDING_VERIFICATION',
        roleId: `${roleId}`,
        image: `https://ui-avatars.com/api/?uppercase=true&name=${name}&background=random&color=random&size=128`,
        password: await encryptPassword({ password }),
        resetPasswordToken: reset.resetPasswordToken,
        resetPasswordExpire: reset.resetPasswordExpire,
      },
      update: {
        status: 'PENDING_VERIFICATION',
        resetPasswordToken: reset.resetPasswordToken,
        resetPasswordExpire: reset.resetPasswordExpire,
        password: await encryptPassword({ password }),
      },
    })

    const device = await getDevice({
      req,
      hasIp: true,
    })

    const result = await handleEmailFire({
      to: email,
      subject: 'Verify your email',
      html: render(
        VerifyAccount({
          clientName: device.clientName,
          osName: device.osName,
          token: reset.resetToken,
          company: 'Ahmed Ibra',
          ip: device.ip,
          baseUrl: device.url,
        })
      ),
    })

    if (result)
      return NextResponse.json({
        message: `An email has been sent to ${email} with further instructions to verify your account.`,
      })

    return getErrorResponse('Something went wrong', 500)
  } catch (error: any) {
    const { status = 500, message } = error
    return getErrorResponse(message, status, error, req)
  }
}
