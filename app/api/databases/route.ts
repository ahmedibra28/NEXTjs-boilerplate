import { NextResponse } from 'next/server'
import { getErrorResponse } from '@/lib/helpers'
import { readdirSync } from 'fs'
import { promisify } from 'util'
import { exec } from 'child_process'
import { isAuth } from '@/lib/auth'

const execAsync = promisify(exec)

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const path = process.cwd() + '/db'
    await execAsync(`mkdir -p ${path}`)
    const databases = readdirSync(path)

    return NextResponse.json({ data: databases?.reverse() || [] })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
