import { NextResponse } from 'next/server'
import { getErrorResponse, getBackupDirectory } from '@/lib/helpers'
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { isAuth } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    await isAuth(req)

    const backupDirPath = getBackupDirectory() // Get the consistent path

    // Ensure the directory exists before trying to read it
    if (!existsSync(backupDirPath)) {
      // If it doesn't exist, it means no backups have been made yet.
      // Optionally create it here, or just return an empty list.
      mkdirSync(backupDirPath, { recursive: true }) // Create if doesn't exist
      console.log(`Created base backup directory during GET: ${backupDirPath}`)
      return NextResponse.json({ data: [] }) // Return empty list
    }

    // Read only .zip files
    const databases = readdirSync(backupDirPath).filter((file) =>
      file.endsWith('.zip')
    )

    return NextResponse.json({ data: databases?.reverse() || [] })
  } catch (error: any) {
    console.error('Failed to list backups:', error)
    const { status = 500, message } = error
    return getErrorResponse(message || 'Failed to list backups', status, error)
  }
}
