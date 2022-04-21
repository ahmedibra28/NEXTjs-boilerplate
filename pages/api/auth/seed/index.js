'use strict'
import nc from 'next-connect'
import User from '../../../../models/User.js'
import Profile from '../../../../models/Profile.js'
import Role from '../../../../models/Role.js'
import Permission from '../../../../models/Permission.js'
import UserRole from '../../../../models/UserRole.js'
import ClientPermission from '../../../../models/ClientPermission.js'

import db from '../../../../config/db'

import {
  users,
  profile,
  roles,
  permissions,
  clientPermissions,
} from '../../../../config/data'

const handler = nc()

const secret = 'js'

handler.get(async (req, res) => {
  await db()
  try {
    if (!req.query.secret || req.query.secret !== secret)
      return res.status(401).json({ error: 'Unauthorized' })

    // Delete all existing data
    await User.deleteMany({})
    await Profile.deleteMany({})
    await Role.deleteMany({})
    await Permission.deleteMany({})
    await UserRole.deleteMany({})
    await ClientPermission.deleteMany({})

    // Create users
    const userObject = await User.create({
      name: users.name,
      email: users.email,
      password: users.password,
      confirmed: true,
      blocked: false,
    })

    // Create profiles for users
    await Profile.create({
      user: userObject._id,
      name: userObject.name,
      address: profile.address,
      phone: profile.phone,
      bio: profile.bio,
      image: `https://ui-avatars.com/api/?uppercase=true&name=${userObject.name}&background=random&color=random&size=128`,
    })

    // Check duplicate permissions
    permissions.map((p) => {
      if (p.method && p.route) {
        const duplicate = permissions.filter(
          (p2) => p2.method === p.method && p2.route === p.route
        )
        if (duplicate.length > 1) {
          return res.status(500).json({
            error: `Duplicate permission: ${p.method} ${p.route}`,
          })
        }
      }
    })

    // Create permissions
    const permissionObjects = await Permission.create(permissions)

    // Create client permissions
    const clientPermissionObjects = await ClientPermission.create(
      clientPermissions
    )

    // Create roles
    const roleObjects = await Role.create(roles)

    // Create user roles
    roleObjects.map(
      async (r) =>
        r.type === 'SUPER_ADMIN' &&
        (await UserRole.create({
          user: userObject._id,
          role: r._id,
        }))
    )

    // Find super admin role
    const superAdminRole = roleObjects.find((r) => r.type === 'SUPER_ADMIN')

    // Create permissions for super admin role
    superAdminRole.permission = permissionObjects.map((p) => p._id)

    // create client permissions for super admin role
    superAdminRole.clientPermission = clientPermissionObjects.map((p) => p._id)

    // Update super admin role
    await superAdminRole.save()

    res.status(200).json({
      message: 'Database seeded successfully',
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
