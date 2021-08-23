import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import User from '../../../../models/User'
import { generateToken, isAuth, isAdmin } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await dbConnect()
  let query = User.find()

  const page = parseInt(req.query.page) || 1
  const pageSize = parseInt(req.query.limit) || 50
  const skip = (page - 1) * pageSize
  const total = await User.countDocuments()

  const pages = Math.ceil(total / pageSize)

  query = query
    .skip(skip)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .select('-password')

  const result = await query

  res.status(200).json({
    startIndex: skip + 1,
    endIndex: skip + result.length,
    count: result.length,
    page,
    pages,
    total,
    data: result,
  })
})

handler.post(async (req, res) => {
  await dbConnect()

  const { name, email, password, group } = req.body
  const userExist = await User.findOne({ email })
  if (userExist) {
    return res.status(400).send('User already exist')
  }

  const userCreate = await User.create({
    name,
    email,
    password,
    group,
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
