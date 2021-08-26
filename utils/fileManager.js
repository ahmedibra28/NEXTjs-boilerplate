import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

// import fileUpload from 'express-fileupload'
// export const config = { api: { bodyParser: false } }
// handler.use(fileUpload())

export const upload = async (args) => {
  const { fileName, fileType, path } = args

  if (!fileName) {
    throw new Error('Please, upload a file')
  }

  const fullName = fileName && fileName.name.split('.').shift()
  const extension = fileName && fileName.name.split('.').pop()

  const fullFileName = fileName && `${fullName}-${Date.now()}.${extension}`

  const filePath = `/public/${path}/${fullFileName}`

  const files = /(\.pdf|\.docx|\.doc)$/i
  const images = /(\.jpg|\.jpeg|\.png|\.gif|\.svg)$/i

  if (fileType === 'file' && !files.exec(fileName && fullFileName)) {
    throw new Error(`${extension} extension is not allowed`)
  } else if (fileType === 'image' && !images.exec(fileName && fullFileName)) {
    throw new Error(`${extension} extension is not allowed`)
  } else {
    await fileName.mv(path.join(__dirname, filePath), (err) => {
      if (err) {
        throw new Error(err)
      }
    })

    return {
      fullFileName,
      filePath,
    }
  }
}

export const deleteFile = (args) => {
  const { path } = args

  const destroy =
    path &&
    fs.unlink(path.join(__dirname, path), (err) => {
      if (err) {
        throw new Error(err)
      }
    })

  if (destroy) {
    return { success: true }
  }
}
