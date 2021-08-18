// export const errorHandler = (err, req, res, next) => {
//   console.log(res)
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode
//   res.status(statusCode)
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//   })
// }

export const errorHandler = (error) => {
  return error.response && error.response.data
    ? error.response.data
    : error.message
}
