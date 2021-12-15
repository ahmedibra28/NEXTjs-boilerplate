import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI)
  throw new Error(
    'Please define the MONGO_URI environment variable inside .env'
  )

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function db() {
  if (cached.conn) cached.conn

  if (!cached.promise)
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose)

  cached.conn = await cached.promise

  return cached.conn
}

export default db