import crypto from 'crypto'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userScheme = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    group: { type: String, required: true },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
)

userScheme.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userScheme.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userScheme.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000) // Ten Minutes

  return resetToken
}

const User = mongoose.models.User || mongoose.model('User', userScheme)
export default User
