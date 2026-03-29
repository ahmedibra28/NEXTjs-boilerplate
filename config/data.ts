const roles = [
  {
    id: 'HzdmUa40IctkReRd2Pofm',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    id: 'a75POUlJzMDmaJtz0JCxp',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
]

const users = {
  id: 'e5cTUpLtGS7foE42nJuwp',
  name: 'Ahmed Ibrahim',
  email: 'info@ahmedibra.com',
  password: '123456',
  status: 'ACTIVE',
  mobile: '252615301507',
  image: 'https://github.com/ahmedibra28.png',
  bio: 'Full Stack Developer',
}

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
}

const clientPermissions = [
  {
    id: 'MZ4Qsx2e-g96eMw0X2qul',
    name: 'Home',
    key: 'home.view',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    id: 'IYN1EVSvUg0o5pAxgPEPi',
    name: 'Users',
    key: 'users.page',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    id: 'VFGo5W_hc3O85QCOouabO',
    name: 'Roles',
    key: 'roles.page',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    id: 't-Snd86AW-TlIlMEDmYyt',
    name: 'Profile',
    key: 'profile.page',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    id: 'eWpbNJ9LkTVO4BYyaO1mJ',
    name: 'Permissions',
    key: 'permissions.page',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC2',
    name: 'Client Permissions',
    key: 'client-permissions.page',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGsOC2',
    name: 'Database',
    key: 'database.page',
    path: '/admin/database',
    menu: 'admin',
    sort: sort.admin,
    description: 'Database page',
  },
]

const permissions = [
  // Users
  {
    id: 'fCuAED2qkbOmWYmKsOa-_',
    key: 'users.read',
    name: 'Users',
    description: 'View users',
  },
  {
    id: 'UzN2L6RQ_gUM0_JN4ALkB',
    key: 'users.access.read',
    name: 'Users',
    description: 'View a user access profile',
  },
  {
    id: 'rqRYCpC0yytkColvHwY3C',
    key: 'users.create',
    name: 'Users',
    description: 'Create users',
  },
  {
    id: 'xsei4vGvYpoXw3V0_Bgcy',
    key: 'users.update',
    name: 'Users',
    description: 'Update users',
  },
  {
    id: '27vMGpNbQGLKtuaIsTAcF',
    key: 'users.delete',
    name: 'Users',
    description: 'Delete users',
  },

  //   Profile
  {
    id: 'Fyph8SxjGayAHr8g65Rie',
    key: 'profile.read',
    name: 'Profile',
    description: 'View profile',
  },
  {
    id: 'LMG211l6gxRRkjAHPvhgw',
    key: 'profile.update',
    name: 'Profile',
    description: 'Update profile',
  },

  //   Role
  {
    id: '2xiakJtuDptmlP7fxgggo',
    key: 'roles.read',
    name: 'Roles',
    description: 'View roles',
  },
  {
    id: 'HQ8Drbd0-KOMequqhQVuG',
    key: 'roles.create',
    name: 'Roles',
    description: 'Create roles',
  },
  {
    id: 'GzrnbouFYGvGfvdAfbiZT',
    key: 'roles.update',
    name: 'Roles',
    description: 'Update roles',
  },
  {
    id: 'KrZ76u2VUI9qICSJhsuW5',
    key: 'roles.delete',
    name: 'Roles',
    description: 'Delete roles',
  },

  //   Permission
  {
    id: '9P0mpbew9dYW4oF9cM-mO',
    key: 'permissions.read',
    name: 'Permissions',
    description: 'View backend permissions',
  },
  {
    id: 'n0dw4GMpgiXfySbdlGhs0',
    key: 'permissions.create',
    name: 'Permissions',
    description: 'Create backend permissions',
  },
  {
    id: 'tK5RgtYLe9yFNgF93m6TO',
    key: 'permissions.update',
    name: 'Permissions',
    description: 'Update backend permissions',
  },
  {
    id: 'cn25W3-inLybNRkCMHgNC',
    key: 'permissions.delete',
    name: 'Permissions',
    description: 'Delete backend permissions',
  },

  //   Client Permission
  {
    id: 'X26iEN1J-LBaC4HlPsRgh',
    key: 'client-permissions.read',
    name: 'Client Permissions',
    description: 'View client permissions',
  },
  {
    id: 'HRu69jNp0j4pJXs_cjCQ5',
    key: 'client-permissions.create',
    name: 'Client Permissions',
    description: 'Create client permissions',
  },
  {
    id: 'X9ACZfrFX9CAl-2uPXyw9',
    key: 'client-permissions.update',
    name: 'Client Permissions',
    description: 'Update client permissions',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxA',
    key: 'client-permissions.delete',
    name: 'Client Permissions',
    description: 'Delete client permissions',
  },
  //  Upload
  {
    id: 'YTU-o6vjJk4A-4uM8kgxM',
    key: 'uploads.create',
    name: 'Upload',
    description: 'Upload files',
  },
  //   Database
  {
    id: 'X26iEN1a-LBaC4HlPsRgh',
    key: 'databases.download',
    name: 'Database',
    description: 'Download database backups',
  },
  {
    id: 'X26iEN1a-LBaC4HlPPRgh',
    key: 'databases.read',
    name: 'Database',
    description: 'View database backups',
  },
  {
    id: 'HRu69jNpsj4pJXs_cjCQ5',
    key: 'databases.backup',
    name: 'Backup database',
    description: 'Create database backups',
  },
]

export { roles, users, permissions, clientPermissions }
