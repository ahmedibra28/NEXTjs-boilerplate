import nc from 'next-connect'
import db from '../../../config/db'
import UserRole from '../../../models/UserRole'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = nc()
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  await db()
  try {
    const { user } = req.query
    console.log(user)
    const userRole = await UserRole.findOne({ user }, { role: 1 }).populate({
      path: 'role',
      populate: {
        path: 'clientPermission',
      },
    })

    const access = userRole?.role?.clientPermission?.map(
      (a: { menu: string; name: string; path: string; sort: number }) => ({
        menu: a?.menu,
        name: a?.name,
        path: a?.path,
        sort: a?.sort,
      })
    )
    return res.send({ access, role: userRole?.role?.type })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
