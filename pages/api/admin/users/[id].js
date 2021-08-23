import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import User from '../../../../models/User'
import { isAuth, isAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.put(async (req, res) => {
  await dbConnect()

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
  await dbConnect()

  const user = await User.findById(req.query.id)

  if (req.query.id.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .send("You can't delete your own user in the admin area.")
  }

  if (user) {
    await user.remove()

    res.send({ message: 'User removed' })
  } else {
    return res.status(404).send('User not found')
  }
})

export default handler
