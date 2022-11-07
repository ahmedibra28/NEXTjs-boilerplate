import nc from 'next-connect'
import db from '../../../../config/db'
import Role from '../../../../models/Role'
import User from '../../../../models/User'
import UserRole from '../../../../models/UserRole'
import { isAuth } from '../../../../utils/auth'

const schemaName = UserRole

const handler = nc()
handler.get(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    try {
      const q = req.query && req.query.q

      const role = q ? await Role.findOne({ name: q }) : null

      let query = schemaName.find(role ? { role: role._id } : {})

      const page = parseInt(req.query.page as string) || 1
      const pageSize = parseInt(req.query.limit as string) || 25
      const skip = (page - 1) * pageSize
      const total = await schemaName.countDocuments(
        role ? { role: role._id } : {}
      )

      const pages = Math.ceil(total / pageSize)

      query = query
        .skip(skip)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean()
        .populate('user')
        .populate('role')

      const result = await query

      res.status(200).json({
        startIndex: skip + 1,
        endIndex: skip + result.length,
        count: result.length,
        page,
        pages,
        total,
        data: result,
      })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

handler.use(isAuth)
handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()
    const { user, role } = req.body
    if (!user || !role) return res.status(400).json({ error: 'Bad request' })
    try {
      const userExist = await User.findById(user)
      if (!userExist)
        return res.status(400).json({ error: 'User does not exist' })

      const roleExist = await Role.findById(role)
      if (!roleExist)
        return res.status(400).json({ error: 'Role does not exist' })

      const userRoleExist = await UserRole.findOne({ user })
      if (userRoleExist)
        return res.status(400).json({ error: 'User Role already exist' })

      const object = await schemaName.create(req.body)
      res.status(200).send(object)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

export default handler
