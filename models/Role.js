import mongoose from 'mongoose'
import ClientPermission from './ClientPermission'
import Permission from './Permission'

const roleScheme = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, unique: true, toUpperCase: true },
    description: String,
    permission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Permission,
      },
    ],
    clientPermission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ClientPermission,
      },
    ],
  },
  { timestamps: true }
)

const Role = mongoose.models.Role || mongoose.model('Role', roleScheme)
export default Role
