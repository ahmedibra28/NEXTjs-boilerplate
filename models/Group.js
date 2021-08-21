import mongoose from 'mongoose'
import Route from './Route'

const groupScheme = mongoose.Schema(
  {
    name: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: true },
    route: [
      { type: mongoose.Schema.Types.ObjectId, ref: Route, required: true },
    ],
  },
  { timestamps: true }
)

const Group = mongoose.models.Group || mongoose.model('Group', groupScheme)
export default Group
