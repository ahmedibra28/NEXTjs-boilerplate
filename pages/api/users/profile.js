import nc from 'next-connect'
import db from '../../../utils/db'
import User from '../../../models/User'
import { generateToken, isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()
  const user = await User.findById(req.user._id)
  if (user) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      group: user.group,
    })
  } else {
    res.status(404)
    throw new Error('User can not be found!')
  }

  await db.disconnect()
})

handler.put(async (req, res) => {
  await db.connect()

  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email.toLowerCase() || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    await db.disconnect()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      group: updatedUser.group,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('Invalid user data')
  }
})

export default handler
