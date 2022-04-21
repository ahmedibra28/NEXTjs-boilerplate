import mongoose from 'mongoose'

const permissionScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    method: {
      type: String,
      toUpperCase: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      required: true,
    },
    route: { type: String, required: true, toLowerCase: true },
    auth: { type: Boolean, default: true },
    description: String,
  },
  { timestamps: true }
)

const Permission =
  mongoose.models.Permission || mongoose.model('Permission', permissionScheme)
export default Permission
