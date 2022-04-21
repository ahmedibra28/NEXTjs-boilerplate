import nc from 'next-connect'
import db from '../../../../config/db'
import Profile from '../../../../models/Profile'
import User from '../../../../models/User'
import { isAuth } from '../../../../utils/auth'

const schemaName = Profile
const schemaNameString = 'Profile'

const handler = nc()
handler.use(isAuth)
handler.get(async (req, res) => {
  await db()
  try {
    const { _id } = req.user
    const objects = await schemaName
      .findOne({ user: _id })
      .lean()
      .sort({ createdAt: -1 })
      .populate('user', ['name', 'email', 'confirmed', 'blocked'])

    res.status(200).send(objects)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

handler.post(async (req, res) => {
  await db()
  try {
    const { _id } = req.user
    const { name, address, phone, bio, image, password } = req.body

    const object = await schemaName.findOne({ user: _id }).populate('user')
    if (!object)
      return res.status(400).json({ error: `${schemaNameString} not found` })

    if (name) await User.findOneAndUpdate({ _id }, { name })
    if (password) {
      const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!regex.test(password))
        return res.status(400).json({
          error:
            'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character',
        })

      await User.findOneAndUpdate(
        { _id },
        { password: await object.user.encryptPassword(password) }
      )
    }

    object.name = name ? name : object.name
    object.phone = phone ? phone : object.phone
    object.address = address ? address : object.address
    object.image = image ? image : object.image
    object.bio = bio ? bio : object.bio
    object.user = _id
    await object.save()
    res.status(200).json({ message: `${schemaNameString} updated` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
