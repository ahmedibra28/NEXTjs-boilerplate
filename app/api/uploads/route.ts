import { isAuth } from '@/lib/auth'
import { getEnvVariable, getErrorResponse } from '@/lib/helpers'
import { NextResponse } from 'next/server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const uploadObject = async (fileName: string, data: any, bucket: string) => {
  const s3Client = new S3Client({
    endpoint: getEnvVariable('AWS_DO_ENDPOINT'),
    forcePathStyle: true,
    region: 'us-east-1',
    credentials: {
      accessKeyId: getEnvVariable('AWS_DO_ACCESS_KEY_ID'),
      secretAccessKey: getEnvVariable('AWS_DO_ACCESS_KEY'),
    } as {
      accessKeyId: string
      secretAccessKey: string
    },
  })

  const params = {
    Bucket: 'eballan',
    Key: fileName,
    Body: data,
    ACL: 'public-read',
    Metadata: {
      'x-amz-meta-my-key': 'your-value',
    },
  }

  try {
    // @ts-ignore
    const data = await s3Client.send(new PutObjectCommand(params))

    return data
  } catch (err: any) {
    console.log('Error', err?.message)
    throw {
      message: err?.message,
      status: 500,
    }
  }
}

export async function POST(req: Request) {
  try {
    await isAuth(req)

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const data = await req.formData()
    const files: File[] | null = data.getAll('file') as unknown as File[]

    const allowedImageTypes = ['.png', '.jpg', '.jpeg', '.gif']
    const allowedDocumentTypes = ['.pdf', '.doc', '.docx', '.txt']
    const allowedTypes = ['document', 'image']

    if (!allowedTypes.includes(type as string))
      return getErrorResponse('Invalid file type', 400)

    const isAllowed = files.every((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (type === 'image') return allowedImageTypes.includes(`.${ext}`)
      if (type === 'document') return allowedDocumentTypes.includes(`.${ext}`)
    })

    if (!isAllowed) return getErrorResponse('Invalid file type', 400)

    const promises = files.map(async (file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${file.name.split('.')[0]}-${Date.now()}.${ext}`
      let buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()))

      if (type === 'image') {
        const size = Buffer.byteLength(Buffer.from(buffer))
        if (size > 200000) {
          buffer = await sharp(buffer).resize(400).toBuffer()
        }
      }

      //   await writeFile(filePath, buffer)
      await uploadObject(fileName, buffer, 'images')
      return fileName
    })
    const fileUrls = await Promise.all(promises)
    return NextResponse.json({
      message: 'File uploaded successfully',
      data: fileUrls?.map((url) => ({
        url: `https://farshaxan.blr1.cdn.digitaloceanspaces.com/eballan/${url.replace(
          /\s/g,
          '%20'
        )}`,
      })),
    })
  } catch ({ status = 500, message }: any) {
    return getErrorResponse(message, status)
  }
}
