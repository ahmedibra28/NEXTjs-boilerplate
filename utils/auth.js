import jwt from 'jsonwebtoken'
import User from '../models/User'
import db from './db'

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2hr',
  })
}

export const isAuth = async (req, res, next) => {
  await db.connect()
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
  await db.disconnect()
}

export const isAdmin = async (req, res, next) => {
  if (req.user && req.user.group === 'admin') {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}
