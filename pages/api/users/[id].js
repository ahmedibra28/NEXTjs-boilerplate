import nc from 'next-connect'
import db from '../../../utils/db'
import User from '../../../models/User'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()

  const obj = await User.findById(req.query.id).select('-password')
  if (!obj) {
    return res.status(400).send('User does not exist')
  }

  await db.disconnect()

  res.send(obj)
})

export default handler
