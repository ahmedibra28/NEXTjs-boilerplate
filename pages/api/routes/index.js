import nc from 'next-connect'
import db from '../../../utils/db'
import Route from '../../../models/Route'
import { isAuth } from '../../../utils/auth'

const handler = nc()

handler.get(async (req, res) => {
  await db.connect()

  const obj = await Route.find({}).sort({ createdAt: -1 }).populate('route')

  await db.disconnect()

  res.status(201).json(obj)
})

handler.use(isAuth)
handler.post(async (req, res) => {
  await db.connect()

  const { isActive, component, path, name } = req.body
  const createdBy = req.user.id

  const exist = await Route.findOne({ path })
  if (exist) {
    res.status(400)
    throw new Error('Route already exist')
  }
  const createObj = await Route.create({
    component,
    path,
    isActive,
    createdBy,
    name,
  })
  await db.disconnect()
  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

export default handler
