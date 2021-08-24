export const routes = () => {
  return [
    {
      isActive: true,
      component: 'Home',
      path: '/',
      name: 'Home',
    },
    {
      isActive: true,
      component: 'Dropdown',
      path: '/admin/logon',
      name: 'User Logs',
    },
    {
      isActive: true,
      component: 'Dropdown',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      component: 'Dropdown',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      component: 'Dropdown',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      component: 'Dropdown',
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
