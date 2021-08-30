import mongoose from 'mongoose'

const routeScheme = mongoose.Schema(
  {
    name: { type: String, requited: true },
    menu: { type: String, requited: true },
    path: { type: String, requited: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Route = mongoose.models.Route || mongoose.model('Route', routeScheme)
export default Route
