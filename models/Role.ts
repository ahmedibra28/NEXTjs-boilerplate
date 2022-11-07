import { Schema, model, models } from 'mongoose'
import ClientPermission from './ClientPermission'
import Permission from './Permission'

export interface IRole {
  _id: Schema.Types.ObjectId
  name: string
  type: string
  description?: string
  permission: Schema.Types.ObjectId[]
  clientPermission: Schema.Types.ObjectId[]
  createdAt?: Date
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, unique: true, toUpperCase: true },
    description: String,
    permission: [
      {
        type: Schema.Types.ObjectId,
        ref: Permission,
      },
    ],
    clientPermission: [
      {
        type: Schema.Types.ObjectId,
        ref: ClientPermission,
      },
    ],
  },
  { timestamps: true }
)

const Role = models.Role || model('Role', roleSchema)

export default Role
