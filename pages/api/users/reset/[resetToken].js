import nc from 'next-connect'
import crypto from 'crypto'
import db from '../../../../utils/db'
import User from '../../../../models/User'

const handler = nc()

handler.put(async (req, res) => {
  await db.connect()

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.query.resetToken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return res.status(400).send('Invalid Token')
  } else {
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.send('Password Updated Successfully')
  }

  await db.disconnect()
})

export default handler
