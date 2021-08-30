import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Route from '../../../../models/Route'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, menu, path, name } = req.body
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
      obj.menu = menu
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      res.send({ status: 'success' })
    } else {
      return res.status(400).send(`This ${path} already exist`)
    }
  } else {
    return res.status(404).send('Route not found')
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await Route.findById(_id)
  if (!obj) {
    return res.status(404).send('Route not found')
  } else {
    await obj.remove()

    res.status(201).json({ status: 'success' })
  }
})

export default handler
