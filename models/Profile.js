import mongoose from 'mongoose'
import User from './User'

const profileScheme = mongoose.Schema(
  {
    name: String,
    image: String,
    address: String,
    phone: String,
    bio: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
)

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', profileScheme)
export default Profile
