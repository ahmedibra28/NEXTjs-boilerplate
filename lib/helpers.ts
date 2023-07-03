import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export function getEnvVariable(key: string): string {
  const value = process.env[key]

  if (!value || value.length === 0) {
    console.log(`The environment variable ${key} is not set.`)
    throw new Error(`The environment variable ${key} is not set.`)
  }

  return value
}

export function getErrorResponse(
  error: string | null = null,
  status: number = 500
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? 'fail' : 'error',
      error: error ? error : null,
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

export async function matchPassword({
  enteredPassword,
  password,
}: {
  enteredPassword: string
  password: string
}) {
  return await bcrypt.compare(enteredPassword, password)
}

export async function encryptPassword({ password }: { password: string }) {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export async function getResetPasswordToken() {
  const resetToken = crypto.randomBytes(20).toString('hex')

  return {
    resetToken,
    resetPasswordToken: crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex'),
    resetPasswordExpire: Date.now() + 10 * (60 * 1000), // Ten Minutes
  }
}

export async function generateToken(id: string) {
  const JWT_SECRET = getEnvVariable('JWT_SECRET')
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '1d',
  })
}
