import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { encryptPassword, getErrorResponse } from '@/lib/helpers'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: NextApiRequestExtended) {
  try {
    const { password, resetToken } = await req.json()

    if (!resetToken || !password)
      return getErrorResponse('Invalid request', 401)

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const user =
      resetPasswordToken &&
      (await prisma.user.findFirst({
        where: {
          resetPasswordToken,
          resetPasswordExpire: { gt: Date.now() },
        },
      }))

    if (!user) return getErrorResponse('Invalid token or expired', 401)

    const u = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: null,
        resetPasswordExpire: null,
        password: await encryptPassword({ password }),
      },
    })

    return NextResponse.json({ message: 'Password has been reset' })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
