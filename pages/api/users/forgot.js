import nc from 'next-connect'
import db from '../../../utils/db'
import User from '../../../models/User'
import { forgotMessage } from '../../../utils/forgotEmailTemplate'
import { sendEmail } from '../../../utils/sendEmail'

const handler = nc()

handler.post(async (req, res) => {
  await db.connect()

  const email = req.body.email.toLowerCase()

  const user = await User.findOne({ email })

  if (!user) {
    res.status(404)
    throw new Error('No email could not be sent')
  }

  const resetToken = user.getResetPasswordToken()

  await user.save()

  const resetUrl = `http://localhost:3000/reset/${resetToken}`

  const message = forgotMessage(resetUrl, user)

  try {
    sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    })

    res.send(
      `An email has been sent to ${user.email} with further instructions.`
    )
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    res.status(404)
    throw new Error('Email could not be sent')
  }
  await db.disconnect()
})

export default handler
