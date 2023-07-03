import { isAuth } from '@/lib/auth'
import { getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function GET(req: NextApiRequestExtended) {
  try {
    await isAuth(req)

    const userObj = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        image: true,
        bio: true,
        address: true,
      },
    })

    return NextResponse.json(userObj)
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
