import nc from 'next-connect'
import db from '../../../utils/db'
import User from '../../../models/User'
import { generateToken, isAuth } from '../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.post(async (req, res) => {
  await db.connect()

  const { name, email, password } = req.body
  const userExist = await User.findOne({ email })
  if (userExist) {
    res.status(400)
    throw new Error('User already exist')
  }

  const userCreate = await User.create({
    name,
    email,
    password,
    group: 'user',
  })
  await db.disconnect()

  if (userCreate) {
    res.status(201).json({
      _id: userCreate._id,
      name: userCreate.name,
      email: userCreate.email,
      group: userCreate.group,
      token: generateToken(userCreate._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

export default handler
