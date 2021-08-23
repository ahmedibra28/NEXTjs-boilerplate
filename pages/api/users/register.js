import nc from 'next-connect'
import dbConnect from '../../../utils/db'
import User from '../../../models/User'
import { generateToken } from '../../../utils/auth'

const handler = nc()

handler.post(async (req, res) => {
  await dbConnect()

  const { name, email, password } = req.body
  const userExist = await User.findOne({ email })
  if (userExist) {
    return res.status(400).send('User already exist')
  }

  const userCreate = await User.create({
    name,
    email,
    password,
    group: 'user',
  })

  if (userCreate) {
    res.status(201).json({
      _id: userCreate._id,
      name: userCreate.name,
      email: userCreate.email,
      group: userCreate.group,
      token: generateToken(userCreate._id),
    })
  } else {
    return res.status(400).send('Invalid user data')
  }
})

export default handler
