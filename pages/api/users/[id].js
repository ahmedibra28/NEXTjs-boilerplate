import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import User from '../../../models/User'
import { isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await User.findById(req.query.id).select('-password')
  if (!obj) {
    return res.status(400).send('User does not exist')
  }

  res.send(obj)
})

export default handler
