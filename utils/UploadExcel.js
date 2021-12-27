import readXlsxFile from 'read-excel-file'

const ImportExcel = async (file, fields) => {
  if (file) {
    const rows = await readXlsxFile(file)
    const obj = rows.map((row) =>
      fields.map((f, i) => ({
        [f]: row[i],
      }))
    )
    return obj ? obj.slice(1) : []
  }
}

export default ImportExcel
