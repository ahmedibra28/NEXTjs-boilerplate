import nc from 'next-connect'
import crypto from 'crypto'
import User from '../../../../models/User'
import dbConnect from '../../../../utils/db'

const handler = nc()

handler.put(async (req, res) => {
  await dbConnect()

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
})

export default handler
