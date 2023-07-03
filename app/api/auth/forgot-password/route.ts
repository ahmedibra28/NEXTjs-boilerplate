import { sendEmail } from '@/lib/nodemailer'
import DeviceDetector from 'device-detector-js'
import { eTemplate } from '@/lib/eTemplate'
import { NextResponse } from 'next/server'
import { getErrorResponse, getResetPasswordToken } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    const { email } = await req.json()
    if (!email) return getErrorResponse('Please enter your email', 400)

    const host = req.headers.get('host') // localhost:3000
    const protocol = req.headers.get('x-forwarded-proto') // http

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
      client: { type: clientType, name: clientName },
      os: { name: osName },
      device: { type: deviceType, brand },
    } = device

    const message = eTemplate({
      url: `${protocol}://${host}/auth/reset-password/${reset.resetToken}`,
      user: user.name,
      clientType,
      clientName,
      osName,
      deviceType,
      brand,
      webName: 'Next.JS Boilerplate',
      validTime: '10 minutes',
      addressStreet: 'Makka Almukarrama',
      addressCountry: 'Mogadishu - Somalia',
    })

    const result = await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
      webName: 'Next.JS Boilerplate Team',
    })

    if (result)
      return NextResponse.json({
        message: `An email has been sent to ${email} with further instructions.`,
      })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
