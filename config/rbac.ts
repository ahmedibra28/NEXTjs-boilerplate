export type AppPermissionKey = string

export type AppNavItem = {
  name: string
  key: string
  path: string
  menu: string
  sort: number
  description: string
}

export type SystemPermissionDefinition = {
  key: string
  name: string
  description: string
}

export type SystemRoleDefinition = {
  type: string
  name: string
  description: string
  permissionKeys: string[]
  clientPermissionKeys: string[]
}

export const SYSTEM_CLIENT_PERMISSIONS: AppNavItem[] = [
  {
    name: 'Home',
    key: 'home.view',
    path: '/',
    menu: 'hidden',
    sort: 0,
    description: 'Dashboard home page',
  },
  {
    name: 'Profile',
    key: 'profile.view',
    path: '/account/profile',
    menu: 'profile',
    sort: 1,
    description: 'User profile page',
  },
  {
    name: 'Users',
    key: 'users.page',
    path: '/admin/users',
    menu: 'admin',
    sort: 2,
    description: 'User management',
  },
  {
    name: 'Roles',
    key: 'roles.page',
    path: '/admin/roles',
    menu: 'admin',
    sort: 3,
    description: 'Role management',
  },
  {
    name: 'Permissions',
    key: 'permissions.page',
    path: '/admin/permissions',
    menu: 'admin',
    sort: 4,
    description: 'Permission management',
  },
  {
    name: 'Navigation',
    key: 'client-permissions.page',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: 5,
    description: 'Navigation access management',
  },
  {
    name: 'Database',
    key: 'database.page',
    path: '/admin/database',
    menu: 'admin',
    sort: 6,
    description: 'Database backup tools',
  },
]

export const SYSTEM_PERMISSIONS: SystemPermissionDefinition[] = [
  {
    key: 'home.view',
    name: 'Home',
    description: 'View the dashboard home page',
  },
  {
    key: 'profile.view',
    name: 'Profile',
    description: 'View personal profile',
  },
  {
    key: 'profile.update',
    name: 'Profile',
    description: 'Update personal profile',
  },
  {
    key: 'users.read',
    name: 'Users',
    description: 'View users list',
  },
  {
    key: 'users.create',
    name: 'Users',
    description: 'Create users',
  },
  {
    key: 'users.update',
    name: 'Users',
    description: 'Update users',
  },
  {
    key: 'users.delete',
    name: 'Users',
    description: 'Delete users',
  },
  {
    key: 'users.access.read',
    name: 'Users',
    description: 'Read user navigation access',
  },
  {
    key: 'database.read',
    name: 'Database',
    description: 'View backups and database tools',
  },
  {
    key: 'database.backup',
    name: 'Database',
    description: 'Create database backups',
  },
  {
    key: 'database.download',
    name: 'Database',
    description: 'Download database backups',
  },
  {
    key: 'access.reference.read',
    name: 'Access',
    description: 'View role and permission management pages',
  },
]

export const SYSTEM_ROLES: SystemRoleDefinition[] = [
  {
    type: 'owner',
    name: 'Owner',
    description: 'Full ERP administration including access management.',
    permissionKeys: SYSTEM_PERMISSIONS.map((permission) => permission.key),
    clientPermissionKeys: SYSTEM_CLIENT_PERMISSIONS.map((permission) => permission.key),
  },
  {
    type: 'admin',
    name: 'Admin',
    description: 'Operational administrator with user and database management.',
    permissionKeys: [
      'home.view',
      'profile.view',
      'profile.update',
      'users.read',
      'users.create',
      'users.update',
      'users.delete',
      'users.access.read',
      'database.read',
      'database.backup',
      'database.download',
    ],
    clientPermissionKeys: [
      'home.view',
      'profile.view',
      'users.page',
      'database.page',
    ],
  },
  {
    type: 'manager',
    name: 'Manager',
    description: 'Read-only access to users plus standard profile access.',
    permissionKeys: [
      'home.view',
      'profile.view',
      'profile.update',
      'users.read',
      'users.access.read',
    ],
    clientPermissionKeys: [
      'home.view',
      'profile.view',
      'users.page',
    ],
  },
  {
    type: 'staff',
    name: 'Staff',
    description: 'Basic signed-in access to home and personal profile.',
    permissionKeys: ['home.view', 'profile.view', 'profile.update'],
    clientPermissionKeys: ['home.view', 'profile.view'],
  },
]
