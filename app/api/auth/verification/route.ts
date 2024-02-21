import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    const { verificationToken } = await req.json()

    if (!verificationToken) return getErrorResponse('Invalid request', 401)

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex')

    const user =
      resetPasswordToken &&
      (await prisma.user.findFirst({
        where: {
          resetPasswordToken,
          resetPasswordExpire: { gt: Date.now() },
        },
      }))

    if (!user)
      return getErrorResponse(
        'Invalid token or expired, please register your account again',
        401
      )

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpire: null,
        confirmed: true,
      },
    })

    return NextResponse.json({
      message: 'Account has been verified successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
