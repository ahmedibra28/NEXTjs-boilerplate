import nc from 'next-connect'
import db from '../../../utils/db'
import User from '../../../models/User'
import UserLogon from '../../../models/UserLogon'
import { generateToken } from '../../../utils/auth'

const handler = nc()

handler.post(async (req, res) => {
  await db.connect()

  const email = req.body.email.toLowerCase()
  const password = req.body.password

  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    await UserLogon.create({
      user: user._id,
    })

    await db.disconnect()
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      group: user.group,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

export default handler
