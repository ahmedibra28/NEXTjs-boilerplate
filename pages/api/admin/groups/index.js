import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Group from '../../../../models/Group'
import { isAuth } from '../../../../utils/auth'

const handler = nc()

handler.get(async (req, res) => {
  await dbConnect()

  const obj = await Group.find({}).sort({ createdAt: -1 }).populate('route')

  res.send(obj)
})

handler.use(isAuth)
handler.post(async (req, res) => {
  await dbConnect()

  const { isActive, route } = req.body
  const createdBy = req.user.id
  const name = req.body.name.toLowerCase()

  const exist = await Group.findOne({ name })
  if (exist) {
    return res.status(400).send('Group already exist')
  }
  const createObj = await Group.create({
    name,
    isActive,
    createdBy,
    route,
  })

  if (createObj) {
    res.status(201).json({ status: 'success' })
  } else {
    return res.status(400).send('Invalid data')
  }
})

export default handler
