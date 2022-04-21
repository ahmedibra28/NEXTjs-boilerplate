import nc from 'next-connect'
import path from 'path'
import fileUpload from 'express-fileupload'
export const config = { api: { bodyParser: false } }
const __dirname = path.resolve()

const handler = nc()
handler.use(fileUpload())

handler.post(async (req, res) => {
  // check if there is no files
  if (!req.files)
    return res.status(400).json({ msg: 'No files were uploaded.' })

  // check if files are in array format and return if not make it array
  let files = Array.isArray(req.files.file) ? req.files.file : [req.files.file]

  // allowed image extensions
  const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif']

  // allowed file extensions
  const allowedFileExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
  ]

  const fileType = req.query.type
  const allowedFileTypes = ['image', 'file']

  // check if file type is allowed
  const isAllowedFileType = allowedFileTypes.includes(fileType)
  if (!isAllowedFileType)
    return res.status(400).json({ msg: 'File type is not allowed.' })

  // check if file is allowed
  const isAllowed = files.every((file) => {
    const fileExtension = path.extname(file.name).split('.')[1]
    return fileType === 'image'
      ? allowedImageExtensions.includes(fileExtension)
      : fileType === 'file' && allowedFileExtensions.includes(fileExtension)
  })

  // stop all if one file is not allowed format
  if (!isAllowed)
    return res.status(400).json({
      msg: `Allowed file formats are ${
        fileType === 'image'
          ? allowedImageExtensions
          : fileType === 'file' && allowedFileExtensions
      }`,
    })

  // upload files passed the conditions
  let filePaths = []
  files.forEach((file) => {
    const fileExtension = path.extname(file.name)
    const baseName = path.basename(file.name, `${fileExtension}`)
    const fileName = `${baseName}-${Date.now()}${fileExtension}`

    const filePath = path.join(__dirname, '/public/uploads', fileName)

    file.mv(filePath, (err) => {
      if (err) return res.status(500).json({ error: err })
    })
    filePaths.push({
      name: file.name,
      path: `/uploads/${fileName}`,
    })
  })
  return res
    .status(200)
    .json({ message: 'File uploaded successfully', filePaths })
})

export default handler
