import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Group from '../../../../models/Group'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const isActive = req.body.isActive
  const route = req.body.route
  const updatedBy = req.user.id
  const name = req.body.name.toLowerCase()
  const _id = req.query.id

  const obj = await Group.findById(_id)

  if (obj) {
    const exist = await Group.find({ _id: { $ne: _id }, name })
    if (exist.length === 0) {
      obj.name = name
      obj.route = route
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      res.json({ status: 'success' })
    } else {
      return res.status(400).send(`This ${name} Group already exist`)
    }
  } else {
    return res.status(404).send('Group not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Group.findById(_id)
  if (!obj) {
    return res.status(404).send('Group not found')
  } else {
    await obj.remove()

    res.json({ status: 'success' })
  }
})

export default handler
