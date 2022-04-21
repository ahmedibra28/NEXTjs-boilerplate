import nc from 'next-connect'
import db from '../../../../config/db'
import User from '../../../../models/User'
import { generateToken } from '../../../../utils/auth'

const handler = nc()

handler.post(async (req, res) => {
  try {
    await db()

    const email = req.body.email.toLowerCase()
    const password = req.body.password

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      if (user.blocked)
        return res.status(401).send({ error: 'User is blocked' })

      if (!user.confirmed)
        return res.status(401).send({ error: 'User is not confirmed' })

      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        blocked: user.blocked,
        confirmed: user.confirmed,
        token: generateToken(user._id),
      })
    } else {
      return res.status(401).send({ error: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default handler
