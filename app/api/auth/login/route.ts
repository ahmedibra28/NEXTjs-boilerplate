import { generateToken, getErrorResponse, matchPassword } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma.db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    })

    if (!user) return getErrorResponse('Invalid email or password', 401)

    const match = await matchPassword({
      enteredPassword: password,
      password: user.password,
    })

    if (!match) return getErrorResponse('Invalid email or password', 401)

    if (user.blocked) return getErrorResponse('User is blocked', 401)

    if (!user.confirmed) return getErrorResponse('User is not confirmed', 401)

    const role = await prisma.role.findFirst({
      where: {
        id: user.roleId,
      },
      include: {
        clientPermissions: {
          select: {
            menu: true,
            sort: true,
            path: true,
            name: true,
          },
        },
      },
    })

    if (!role) return getErrorResponse('Role not found', 404)

    const routes = role.clientPermissions

    interface Route {
      menu?: string
      name?: string
      path?: string
      open?: boolean
    }
    interface RouteChildren extends Route {
      children?: { menu?: string; name?: string; path?: string }[] | any
    }
    const formatRoutes = (routes: Route[]) => {
      const formattedRoutes: RouteChildren[] = []

      routes.forEach((route) => {
        if (route.menu === 'hidden') return null
        if (route.menu === 'profile') return null

        if (route.menu === 'normal') {
          formattedRoutes.push({ name: route.name, path: route.path })
        } else {
          const found = formattedRoutes.find((r) => r.name === route.menu)
          if (found) {
            found.children.push({ name: route.name, path: route.path })
          } else {
            formattedRoutes.push({
              name: route.menu,
              open: false,
              children: [{ name: route.name, path: route.path }],
            })
          }
        }
      })

      return formattedRoutes
    }

    const menu = formatRoutes(routes)

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      blocked: user.blocked,
      confirmed: user.confirmed,
      image: user.image,
      role: role.type,
      routes,
      menu,
      token: await generateToken(user.id.toString()),
      message: 'User has been logged in successfully',
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}