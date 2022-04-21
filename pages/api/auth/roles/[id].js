import nc from 'next-connect'
import db from '../../../../config/db'
import Role from '../../../../models/Role'
import UserRole from '../../../../models/UserRole'
import { isAuth } from '../../../../utils/auth'

const schemaName = Role
const schemaNameString = 'Role'

const handler = nc()
handler.use(isAuth)
handler.put(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const { name, description } = req.body
    let type
    let permission = []
    let clientPermission = []
    if (name) type = name.toUpperCase().trim().replace(/\s+/g, '_')

    if (req.body.permission) {
      if (Array.isArray(req.body.permission)) {
        permission = req.body.permission
      } else {
        permission = [req.body.permission]
      }
    }

    if (req.body.clientPermission) {
      if (Array.isArray(req.body.clientPermission)) {
        clientPermission = req.body.clientPermission
      } else {
        clientPermission = [req.body.clientPermission]
      }
    }

    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    object.name = name
    object.type = type
    object.description = description
    object.permission = permission
    object.clientPermission = clientPermission
    await object.save()

    res.status(200).json({ message: `${schemaNameString} updated` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.delete(async (req, res) => {
  await db()
  try {
    const { id } = req.query
    const object = await schemaName.findById(id)
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    if (object.type === 'SUPER_ADMIN')
      return res
        .status(400)
        .json({ error: `${schemaNameString} is super admin` })

    const userRolesObject = await UserRole.find({
      role: object._id,
    })

    if (userRolesObject.length > 0) {
      userRolesObject.forEach(async (userRole) => {
        await userRole.remove()
      })
    }

    await object.remove()
    res.status(200).json({ message: `${schemaNameString} removed` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
