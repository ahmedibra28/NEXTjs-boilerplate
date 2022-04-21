import mongoose from 'mongoose'

const ClientPermissionScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    menu: { type: String, required: true },
    path: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
)

const ClientPermission =
  mongoose.models.ClientPermission ||
  mongoose.model('ClientPermission', ClientPermissionScheme)
export default ClientPermission
