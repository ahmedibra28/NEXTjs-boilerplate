export const routes = () => {
  return [
    {
      isActive: true,
      component: 'UserLogHistoryScreen',
      path: '/admin/users/logs',
      name: 'User Logs',
    },
    {
      isActive: true,
      component: 'UserListScreen',
      path: '/admin/users',
      name: 'Users',
    },
    {
      isActive: true,
      component: 'GroupScreen',
      path: '/admin/groups',
      name: 'Groups',
    },
    {
      isActive: true,
      component: 'RouteScreen',
      path: '/admin/routes',
      name: 'Routes',
    },
    {
      isActive: true,
      component: 'ProfileScreen',
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
