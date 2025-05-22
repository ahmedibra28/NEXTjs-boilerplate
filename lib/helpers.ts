import { NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import { join } from 'path'

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
  status: number = 500,
  prismaError?: Prisma.PrismaClientKnownRequestError,
  req?: Request & { temporaryBody?: any }
) {
  if (prismaError) {
    switch (prismaError.code) {
      case 'P1001':
        error = 'Target database connection error'
        status = 500
        break
      case 'P1002':
        error = 'Query execution error'
        status = 500
        break
      case 'P1003':
        error = 'Prisma Client generation error'
        status = 500
        break
      case 'P1009':
        error = 'Validation error'
        status = 400
        break
      case 'P2000':
        error = 'Database schema has changed'
        status = 500
        break
      case 'P2002':
        error = 'A unique constraint violation occurred.'
        status = 400
        break
      case 'P2003':
        error = `Foreign key constraint failed on the field: ${prismaError.meta?.field_name}`
        status = 400
        break
      case 'P2025':
        error =
          'An operation failed because it depends on one or more records that were required but not found.'
        status = 404
        break
      default:
        error = error || 'An unexpected database error occurred.'
        status = status || 500
        break
    }
  }

  // ===== Start only for bank =====
  const url = req?.url

  if (url && url.includes('/api/bank')) {
    // help full log
    console.log({
      req,
      error,
      body: req?.temporaryBody,
      date: new Date().toISOString(),
    })

    return new NextResponse(
      JSON.stringify({
        ...(url?.includes('login')
          ? {
              token: 'Un authorized',
              status: false,
            }
          : {
              message: 'Failed',
              status: false,
            }),
      }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
  // ===== End only for bank =====

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

export async function getResetPasswordToken(minutes = 10) {
  const resetToken = crypto.randomBytes(20).toString('hex')

  return {
    resetToken,
    resetPasswordToken: crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex'),
    resetPasswordExpire: Date.now() + minutes * (60 * 1000), // Ten Minutes
  }
}

export async function generateToken(id: string) {
  const JWT_SECRET = getEnvVariable('JWT_SECRET')
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '1d',
  })
}

export function getBackupDirectory(): string {
  const backupPath = process.env.BACKUP_PATH
  if (!backupPath) {
    console.warn(
      'BACKUP_PATH environment variable not set. Using default ./db_backups'
    )
    return join(process.cwd(), 'db_backups') // Fallback, less ideal in Docker
  }
  return backupPath // e.g., /app/db_backups (inside container)
}
