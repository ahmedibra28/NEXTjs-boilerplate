import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Route from '../../../../models/Route'
import { isAuth } from '../../../../utils/auth'

const handler = nc()

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Route.find({}).sort({ createdAt: -1 })

  res.status(201).json(obj)
})

handler.use(isAuth)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, menu, path, name } = req.body
  const createdBy = req.user.id

  const exist = await Route.findOne({ path })
  if (exist) {
    return res.status(400).send('Route already exist')
  }
  const createObj = await Route.create({
    menu,
    path,
    isActive,
    createdBy,
    name,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
