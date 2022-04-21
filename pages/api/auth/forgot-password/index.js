import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import { forgotMessage } from '../../../../utils/emailTemplate'
import { sendEmail } from '../../../../utils/nodemailer'

const schemaName = User

const handler = nc()
handler.post(async (req, res) => {
  await db()
  try {
    const { email } = req.body
    if (!email)
      return res.status(400).json({ error: 'Please enter your email' })

    const user = await schemaName.findOne({ email })
    if (!user)
      return res.status(404).json({ error: 'No email could not be send' })

    const resetToken = user.getResetPasswordToken()
    await user.save()

    const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`
    const message = forgotMessage(resetUrl, user)

    const result = sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    })

    if (await result)
      return res.status(200).json({
        message: `An email has been sent to ${email} with further instructions.`,
      })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
