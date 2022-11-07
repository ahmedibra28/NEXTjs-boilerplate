import { Schema, model, models } from 'mongoose'
import Role from './Role'
import User from './User'

export interface IUserRole {
  _id: Schema.Types.ObjectId
  user: Schema.Types.ObjectId
  role: Schema.Types.ObjectId
  createdAt?: Date
}

const userRoleSchema = new Schema<IUserRole>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
      unique: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: Role,
      required: true,
    },
  },
  { timestamps: true }
)

const UserRole = models.UserRole || model('UserRole', userRoleSchema)

export default UserRole
