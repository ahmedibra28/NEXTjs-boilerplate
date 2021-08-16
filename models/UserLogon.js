import mongoose from 'mongoose'

const userLogonScheme = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const UserLogon =
  mongoose.models.UserLogon || mongoose.model('UserLogon', userLogonScheme)
export default UserLogon
