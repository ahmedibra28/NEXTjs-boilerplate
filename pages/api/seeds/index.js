import nc from 'next-connect'
import db from '../../../utils/db'
import Group from '../../../models/Group'
import User from '../../../models/User'
import Route from '../../../models/Route'

import { users, groups, routes } from '../../../utils/data'

const handler = nc()

handler.get(async (req, res) => {
  await db.connect()

  await Route.deleteMany()
  await Route.insertMany(routes())
  const routesId = await Route.find({}, { _id: 1 })

  await Group.deleteMany()
  await Group.insertMany(groups(routesId.map((r) => r._id)))

  await User.deleteMany()
  await User.create(users())

  await db.disconnect()

  res.send({ status: 'success data insertion' })
})

export default handler
