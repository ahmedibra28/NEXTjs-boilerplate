import nc from 'next-connect'
import db from '../../../../utils/db'
import User from '../../../../models/User'
import { isAuth, isAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()

  const obj = await User.findById(req.query.id).select('-password')
  if (!obj) {
    return res.status(400).send('User does not exist')
  }

  await db.disconnect()

  res.send(obj)
})

handler.put(async (req, res) => {
  await db.connect()

  const userExist = await User.findById(req.query.id)

  if (req.query.id.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .send("You can't edit your own user in the admin area.")
  }

  if (userExist) {
    userExist.name = req.body.name || userExist.name
    userExist.group = req.body.group || userExist.group
    userExist.email = req.body.email.toLowerCase() || userExist.email
    if (req.body.password) {
      userExist.password = req.body.password
    }

    const updatedUser = await userExist.save()
    await db.disconnect()

    res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      group: updatedUser.group,
      email: updatedUser.email,
    })
  } else {
    return res.status(404).send('User not found')
  }
})

handler.delete(async (req, res) => {
  await db.connect()

  const user = await User.findById(req.query.id)

  if (req.query.id.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .send("You can't delete your own user in the admin area.")
  }

  if (user) {
    await user.remove()
    await db.disconnect()
    res.send({ message: 'User removed' })
  } else {
    return res.status(404).send('User not found')
  }
})

export default handler
