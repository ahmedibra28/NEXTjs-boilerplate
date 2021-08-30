export const routes = () => {
  return [
    {
      isActive: true,
      menu: 'Normal',
      path: '/',
      name: 'Home',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/logon',
      name: 'User Logs',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      menu: 'Admin',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      menu: 'Profile',
      path: '/profile',
      name: 'Profile',
    },
  ]
}

export const groups = (ids) => {
  return [
    {
      name: 'admin',
      isActive: true,
      route: ids,
    },
  ]
}

export const users = () => {
  return [
    {
      password: '123456',
      name: 'Ahmed',
      email: 'ahmaat19@gmail.com',
      group: 'admin',
    },
  ]
}
