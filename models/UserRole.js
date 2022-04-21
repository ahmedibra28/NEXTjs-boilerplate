import mongoose from 'mongoose'
import Role from './Role'
import User from './User'

const userRoleScheme = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
      unique: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Role,
      required: true,
    },
  },
  { timestamps: true }
)

const UserRole =
  mongoose.models.UserRole || mongoose.model('UserRole', userRoleScheme)
export default UserRole
