export const routes = () => {
  return [
    {
      isActive: true,
      component: 'Normal',
      path: '/',
      name: 'Home',
    },
    {
      isActive: true,
      component: 'Admin',
      path: '/admin/logon',
      name: 'User Logs',
    },
    {
      isActive: true,
      component: 'Admin',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      component: 'Admin',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      component: 'Admin',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      component: 'Profile',
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
