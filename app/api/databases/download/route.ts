import { getErrorResponse } from '@/lib/helpers'
import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'
import { isAuth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    await isAuth(req)

    const { db } = await req.json()

    const path = process.cwd() + '/db'
    const files = readdirSync(path)

    const fileName = files.find((file) => file === db)

    if (!fileName) return getErrorResponse('File not found', 404)

    const buffer = readFileSync(join(path, fileName))

    const headers = new Headers()
    headers.append('Content-Disposition', `attachment; filename=${fileName}`)
    headers.append('Content-Type', 'application/zip')

    return new Response(buffer, {
      headers,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
