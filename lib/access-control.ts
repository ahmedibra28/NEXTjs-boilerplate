import {
  SYSTEM_CLIENT_PERMISSIONS,
  SYSTEM_PERMISSIONS,
  SYSTEM_ROLES,
} from '@/config/rbac'
import { prisma } from './prisma.db'

type ClientPermissionRecord = {
  key: string
  name: string
  description: string | null
  menu: string
  path: string
  sort: number
}

type MenuLeaf = {
  key: string
  name: string
  path: string
  sort: number
}

type MenuGroup = {
  name: string
  sort: number
  open: boolean
  children: MenuLeaf[]
}

export type NavigationItem = MenuLeaf | MenuGroup

function sortMenuItems<T extends { sort: number; name: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    if (a.sort === b.sort) return a.name.localeCompare(b.name)
    return a.sort - b.sort
  })
}

export function buildClientAccess(clientPermissions: ClientPermissionRecord[]) {
  const routes = sortMenuItems(clientPermissions)

  const groupedMenu = routes.reduce<NavigationItem[]>((acc, route) => {
    if (route.menu === 'hidden' || route.menu === 'profile') return acc

    if (route.menu === 'normal') {
      acc.push({
        key: route.key,
        name: route.name,
        path: route.path,
        sort: route.sort,
      })
      return acc
    }

    const existingGroup = acc.find(
      (item): item is MenuGroup =>
        'children' in item && item.name === route.menu,
    )

    if (existingGroup) {
      existingGroup.children.push({
        key: route.key,
        name: route.name,
        path: route.path,
        sort: route.sort,
      })
      existingGroup.children = sortMenuItems(existingGroup.children)
      return acc
    }

    acc.push({
      name: route.menu,
      sort: route.sort,
      open: false,
      children: [
        {
          key: route.key,
          name: route.name,
          path: route.path,
          sort: route.sort,
        },
      ],
    })

    return acc
  }, [])

  const menu = sortMenuItems(
    groupedMenu.map((item) =>
      'children' in item
        ? {
            ...item,
            children: sortMenuItems(item.children),
          }
        : item,
    ),
  )

  return {
    routes,
    menu,
  }
}

export async function syncSystemAccessControl() {
  for (const permission of SYSTEM_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      create: {
        ...permission,
        isSystem: true,
      },
      update: {
        name: permission.name,
        description: permission.description,
        isSystem: true,
      },
    })
  }

  for (const clientPermission of SYSTEM_CLIENT_PERMISSIONS) {
    await prisma.clientPermission.upsert({
      where: { key: clientPermission.key },
      create: {
        ...clientPermission,
        isSystem: true,
      },
      update: {
        name: clientPermission.name,
        menu: clientPermission.menu,
        sort: clientPermission.sort,
        path: clientPermission.path,
        description: clientPermission.description,
        isSystem: true,
      },
    })
  }

  for (const role of SYSTEM_ROLES) {
    const permissionRecords = await prisma.permission.findMany({
      where: { key: { in: role.permissionKeys } },
      select: { id: true },
    })
    const clientPermissionRecords = await prisma.clientPermission.findMany({
      where: { key: { in: role.clientPermissionKeys } },
      select: { id: true },
    })

    await prisma.role.upsert({
      where: { type: role.type },
      create: {
        name: role.name,
        type: role.type,
        description: role.description,
        isSystem: true,
        permissions: {
          connect: permissionRecords.map((permission) => ({ id: permission.id })),
        },
        clientPermissions: {
          connect: clientPermissionRecords.map((clientPermission) => ({
            id: clientPermission.id,
          })),
        },
      },
      update: {
        name: role.name,
        description: role.description,
        isSystem: true,
        permissions: {
          set: permissionRecords.map((permission) => ({ id: permission.id })),
        },
        clientPermissions: {
          set: clientPermissionRecords.map((clientPermission) => ({
            id: clientPermission.id,
          })),
        },
      },
    })
  }
}

export function slugifyRoleType(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
