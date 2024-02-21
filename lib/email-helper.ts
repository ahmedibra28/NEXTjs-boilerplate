import nodemailer from 'nodemailer'

type Payload = {
  to: string
  subject: string
  html: any
}

const smtpSettings = {
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
}

export const handleEmailFire = async (data: Payload) => {
  const transporter = nodemailer.createTransport(smtpSettings)

  return await transporter.sendMail({
    from: process.env.SMTP_USER,
    ...data,
  })
}
