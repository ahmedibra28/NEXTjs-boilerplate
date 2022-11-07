import nc from 'next-connect'
import db from '../../../../config/db'
import ClientPermission from '../../../../models/ClientPermission'
import Role from '../../../../models/Role'
import { isAuth } from '../../../../utils/auth'

const schemaName = ClientPermission
const schemaNameString = 'ClientPermission'

const handler = nc()
handler.use(isAuth)
handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const { name, menu, path, description, sort } = req.body

      const object = await schemaName.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.sort = sort
      object.name = name
      object.menu = menu
      object.path = path
      object.description = description
      await object.save()
      res.status(200).json({ message: `${schemaNameString} updated` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.delete(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const object = await schemaName.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      const rolesObject = await Role.find({
        clientPermission: object._id,
      })

      if (rolesObject.length > 0) {
        rolesObject.forEach(async (role) => {
          role.clientPermission.filter((item: string) => item.toString() !== id)
            .length
          await role.save()
        })
      }

      await object.remove()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
