import { NextResponse } from 'next/server'
import {
  getEnvVariable,
  getErrorResponse,
  getBackupDirectory,
} from '@/lib/helpers'
import { exec } from 'child_process'
import { promisify } from 'util'
import { zip } from 'zip-a-folder'
// import { isAuth } from '@/lib/auth'
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    // await isAuth(req)

    const currentDate = new Date().toISOString().slice(0, 10)
    const currentHour = new Date().getHours().toString().padStart(2, '0')
    // const currentMinute = new Date().getMinutes().toString().padStart(2, '0');

    const baseBackupDir = getBackupDirectory() // Use the consistent path, e.g., /app/db_backups
    const backupFolderName = `${currentDate}_${currentHour}`
    const backupDir = join(baseBackupDir, backupFolderName) // Full path to the temp dump folder
    const zipFilePath = `${backupDir}.zip` // Full path to the final zip file

    // Ensure the base backup directory exists (important for the first run or if volume is empty)
    if (!existsSync(baseBackupDir)) {
      mkdirSync(baseBackupDir, { recursive: true })
      console.log(`Created base backup directory: ${baseBackupDir}`)
    }

    // Create the specific backup directory for this run
    await execAsync(`mkdir -p "${backupDir}"`) // Use quotes for paths

    // Clean up old zip files (logic remains similar, but uses baseBackupDir)
    const allFilesInBackupDir = readdirSync(baseBackupDir)
    const dbZipFiles = allFilesInBackupDir
      ?.filter((item) => item.endsWith('.zip'))
      .sort()

    if (dbZipFiles && dbZipFiles.length > 23) {
      const keepZippedDbs = dbZipFiles.slice(-23)
      const deleteZippedDbs = dbZipFiles.filter(
        (item) => !keepZippedDbs.includes(item)
      )

      // IMPORTANT: Fix async execution in loop
      await Promise.all(
        deleteZippedDbs.map(async (dbZip) => {
          const fullPathToDelete = join(baseBackupDir, dbZip)
          console.log(`Deleting old backup: ${fullPathToDelete}`)
          await execAsync(`rm -f "${fullPathToDelete}"`) // Use rm -f for files
        })
      )
    }

    const POSTGRES_USER = getEnvVariable('POSTGRES_USER')
    const POSTGRES_PASSWORD = getEnvVariable('POSTGRES_PASSWORD')
    // Use DB_HOST and DB_PORT from environment variables (set in docker-compose)
    const DB_HOST = getEnvVariable('DB_HOST')
    const DB_PORT = getEnvVariable('DB_PORT') // Should be 5432 typically for container-to-container
    const POSTGRES_DB = getEnvVariable('POSTGRES_DB') // Assuming 'toptayo' comes from env

    const execute = (dbName: string) =>
      `PGPASSWORD=${POSTGRES_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${POSTGRES_USER} -d ${dbName} -F c -f "${join(backupDir, `${dbName}.dump`)}"`

    // Assuming only one DB for now based on env var
    await execAsync(execute(POSTGRES_DB))

    // Convert folder to zip
    await zip(backupDir, zipFilePath)
    console.log(`Created backup zip: ${zipFilePath}`)

    // Delete folder after zip
    await execAsync(`rm -rf "${backupDir}"`)
    console.log(`Deleted temporary backup folder: ${backupDir}`)

    // Optional: Send backed up db to cloud
    // ...

    return NextResponse.json({
      message: `Database backup successfully created: ${backupFolderName}.zip`,
    })
  } catch (error: any) {
    console.error('Backup failed:', error) // Log the actual error server-side
    const { status = 500, message } = error
    return getErrorResponse(message || 'Backup failed', status, error)
  }
}
