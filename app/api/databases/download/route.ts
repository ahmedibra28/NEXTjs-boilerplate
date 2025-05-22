import { getErrorResponse, getBackupDirectory } from '@/lib/helpers'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'
import { isAuth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    await isAuth(req)

    const { db: requestedFileName } = await req.json()

    if (
      !requestedFileName ||
      typeof requestedFileName !== 'string' ||
      !requestedFileName.endsWith('.zip')
    ) {
      return getErrorResponse('Invalid file name specified', 400)
    }

    const backupDirPath = getBackupDirectory() // Get the consistent path
    const fullFilePath = join(backupDirPath, requestedFileName)

    // Security check: Ensure the requested file is directly within the backup directory
    // and doesn't contain path traversal characters ('..')
    if (
      fullFilePath.indexOf(backupDirPath) !== 0 ||
      requestedFileName.includes('..')
    ) {
      return getErrorResponse('Invalid file path', 400)
    }

    if (!existsSync(fullFilePath)) {
      console.error(`Download failed: File not found at ${fullFilePath}`)
      return getErrorResponse('File not found', 404)
    }

    const buffer = readFileSync(fullFilePath) as Buffer<any>

    const headers = new Headers()
    headers.append(
      'Content-Disposition',
      `attachment; filename="${requestedFileName}"`
    ) // Quote filename
    headers.append('Content-Type', 'application/zip')
    headers.append('Content-Length', buffer.length.toString()) // Good practice to add length

    return new Response(buffer, {
      headers,
    })
  } catch (error: any) {
    console.error('Download failed:', error)
    const { status = 500, message } = error
    return getErrorResponse(message || 'Failed to download file', status, error)
  }
}
