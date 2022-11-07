import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'
import { isAuth } from '../../../../utils/auth'

const schemaName = User
const schemaNameString = 'User'

const handler = nc()
handler.use(isAuth)
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const objects = await schemaName
        .findById(id)
        .lean()
        .sort({ createdAt: -1 })
        .select('-password')

      if (!objects)
        return res.status(404).json({ error: `${schemaNameString} not found` })
      res.status(200).send(objects)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.put(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const { id } = req.query
      const { name, confirmed, blocked, password, email } = req.body

      const object = await schemaName.findById(id)
      if (!object)
        return res.status(400).json({ error: `${schemaNameString} not found` })

      object.name = name
      object.email = email
      object.confirmed = confirmed
      object.blocked = blocked

      password && (object.password = await object.encryptPassword(password))

      if (name) {
        await Profile.findOneAndUpdate({ user: id }, { name })
      }

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

      await Profile.findOneAndDelete({
        user: object._id,
      })

      const userRole = await UserRole.findOne({ user: object._id })
      userRole && (await userRole.remove())

      await object.remove()
      res.status(200).json({ message: `${schemaNameString} removed` })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
