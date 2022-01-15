import nc from 'next-connect'
import dbConnect from '../../../../utils/db'
import Route from '../../../../models/Route'
import { isAuth } from '../../../../utils/auth'

const handler = nc()
handler.use(isAuth)

const modelName = 'Route'
const constants = {
  model: Route,
  success: `${modelName} was updated successfully`,
  failed: `${modelName} was not updated successfully`,
  existed: `${modelName} was already existed`,
}

handler.put(async (req, res) => {
  await dbConnect()

  const { isActive, menu, path, name } = req.body
  const updatedBy = req.user.id

  const _id = req.query.id

  const obj = await constants.model.findById(_id)

  if (obj) {
    const exist = await constants.model.exists({
      _id: { $ne: _id },
      path: path.toLowerCase(),
    })

    if (!exist) {
      obj.path = path
      obj.name = name
      obj.menu = menu
      obj.isActive = isActive
      obj.updatedBy = updatedBy
      await obj.save()

      res.json({ status: constants.success })
    } else {
      return res.status(400).send(constants.failed)
    }
  } else {
    return res.status(404).send(constants.failed)
  }
})

handler.delete(async (req, res) => {
  await dbConnect()

  const _id = req.query.id
  const obj = await constants.model.findById(_id)
  if (!obj) {
    return res.status(404).send(constants.failed)
  } else {
    await obj.remove()

    res.json({ status: constants.success })
  }
})

export default handler
