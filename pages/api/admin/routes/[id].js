import nc from 'next-connect'
import db from '../../../../utils/db'
import Route from '../../../../models/Route'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await db.connect()

  const { isActive, component, path, name } = req.body
  const updatedBy = req.user.id

  const _id = req.query.id

  const obj = await Route.findById(_id)

  if (obj) {
    const exist = await Route.find({
      _id: { $ne: _id },
      path,
    })
    if (exist.length === 0) {
      obj.path = path
      obj.name = name
      obj.component = component
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()
      await db.disconnect()
      res.send({ status: 'success' })
    } else {
      return res.status(400).send(`This ${path} already exist`)
    }
  } else {
    return res.status(404).send('Route not found')
  }
})

handler.delete(async (req, res) => {
  await db.connect()

  const _id = req.query.id
  const obj = await Route.findById(_id)
  if (!obj) {
    return res.status(404).send('Route not found')
  } else {
    await obj.remove()
    await db.disconnect()
    res.status(201).json({ status: 'success' })
  }
})

export default handler
