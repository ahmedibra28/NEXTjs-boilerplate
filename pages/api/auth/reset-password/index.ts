import nc from 'next-connect'
import crypto from 'crypto'
import db from '../../../../config/db'
import User from '../../../../models/User'

const schemaName = User

const handler = nc()

handler.post(
  async (req: NextApiRequestExtended, res: NextApiResponseExtended) => {
    await db()

    try {
      const { password, resetToken } = req.body

      if (!resetToken || !password)
        return res.status(400).json({ error: 'Invalid Request' })

      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

      const user = await schemaName.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      })

      if (!user)
        return res.status(400).json({ error: 'Invalid Token or expired' })

      user.password = password
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      res.status(200).json({ message: 'Password has been reset' })
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)
export default handler
