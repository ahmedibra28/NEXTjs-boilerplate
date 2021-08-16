export const forgotMessage = (resetUrl, user) => {
  return `
    <body
      style="
            background-color: rgb(255, 255, 255);
            padding-left: 10%;
            padding-right: 10%;
            color: rgb(83, 81, 81);
            font-family: 'Roboto', sans-serif;
            max-width: 800px;
            margin: auto;
  "
    >
      <h1
        class='title'
        style='
            padding-top: 10px;
            padding-bottom: 10px;
            padding-right: 10px;
            padding-left: 10px;
            text-align: center;
            font-size: 200%;
    '
      >
        Reset Your Password
      </h1>
      <h3 style='font-size: 130%; font-weight: lighter'>Hello ${user.name},</h3>
      <p style='line-height: 150%; font-size: 120%'>
        Tap the button below to reset your account password. If you didn't
        request a new password, you can safely delete this email.
      </p>
      <div
        class='btn-link'
        style='
            text-align: center;
            margin-top: 10%;
            margin-bottom: 10%;
            margin-right: auto;
            margin-left: auto;
            font-size: 120%;
    '
      >
        <a
          target='blank'
          href=${resetUrl}
          style='
                background-color: rgb(83, 81, 81);
                color: rgb(223, 221, 221);
                padding-top: 15px;
                padding-bottom: 15px;
                padding-right: 15px;
                padding-left: 15px;
                text-decoration: none;
                margin-top: 100px;
                width: 100%;
      '
        >
          Reset Password
        </a>
      </div>

      <p style='line-height: 150%; font-size: 120%'>
        If that doesn't work, copy and paste the following link in your browser:
      </p>
      <div class='text-link' style='font-size: 120%'>
        <a target='blank' href=${resetUrl}>
          ${resetUrl}
        </a>
      </div>

      <p
        class='footer'
        style='line-height: 150%; font-size: medium; padding-top: 10%'
      >
        <span>Thank you,</span> <br />
        <span>Geel Tech Team</span>
      </p>
    </body>
`
}
