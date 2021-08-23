import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import User from '../../../models/User'
import { generateToken, isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.get(async (req, res) => {
  await dbConnect()
  const user = await User.findById(req.user._id)
  if (user) {
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      group: user.group,
    })
  } else {
    return res.status(404).send('User can not be found')
  }
})

handler.put(async (req, res) => {
  await dbConnect()

  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email.toLowerCase() || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      group: updatedUser.group,
      token: generateToken(updatedUser._id),
    })
  } else {
    return res.status(404).send('Invalid user data')
  }
})

export default handler
