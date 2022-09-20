import nodemailer from 'nodemailer'

export const sendEmail = (options: {
  to: string
  subject: string
  text: string
  webName: string
}) => {
  const smtpTransparent = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY,
    },
  })

  const mailOptions = {
    from: `${options?.webName} <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  }

  return smtpTransparent.sendMail(mailOptions)
}
