import { NextResponse } from 'next/server'
import { getEnvVariable, getErrorResponse } from '@/lib/helpers'
import { exec } from 'child_process'
import { promisify } from 'util'
import { zip } from 'zip-a-folder'
import { isAuth } from '@/lib/auth'
import { readdirSync } from 'fs'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    await isAuth(req)

    const currentDate = new Date().toISOString().slice(0, 10)
    const currentHour = new Date().getHours().toString().padStart(2, '0')
    // const currentMinute = new Date().getMinutes().toString().padStart(2, '0')

    const backupDir = `${process.cwd()}/db/${currentDate}_${currentHour}`

    // Create the backup directory if it does not exist
    await execAsync(`mkdir -p ${backupDir}`)

    const dbDirs = readdirSync(`${process.cwd()}/db/`)
    const dbZipDirs = dbDirs?.filter((item) => item.includes('.zip')).sort()
    const keepZippedDbs = dbZipDirs.slice(-2)
    const deleteZippedDbs = dbZipDirs.filter(
      (item) => !keepZippedDbs.includes(item)
    )

    deleteZippedDbs?.forEach(async (db) => {
      await execAsync(`rm -rf ${process.cwd()}/db/${db}`)
    })

    const DB_USER = getEnvVariable('DB_USER')
    const DB_PASS = getEnvVariable('DB_PASS')

    const execute = (dbName: string) =>
      `PGPASSWORD=${DB_PASS} pg_dump -U ${DB_USER} -h localhost -p 5432 -F d -j 4 ${dbName} -f "${backupDir}/${dbName}"`

    const databases = ['boilerplate']

    await Promise.all(
      databases.map(async (dbName) => await execAsync(execute(dbName)))
    )

    // convert folder to zip
    await zip(`${backupDir}`, `${backupDir}.zip`)

    // delete folder after zip
    await execAsync(`rm -rf ${backupDir}`)

    // send backed up db to cloud
    // await uploadObject(
    //   fs.createReadStream(`${backupDir}.zip`),
    //   'db/' + `${backupDir}.zip`.split('db/').pop()
    // )

    return NextResponse.json({
      message: `Database backup successfully created and uploaded`,
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
