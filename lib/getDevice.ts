import axios from 'axios'
import DeviceDetector from 'device-detector-js'

export const getDevice = async ({
  req,
  hasIp = false,
}: {
  req: Request
  hasIp?: boolean
}) => {
  try {
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(
      req.headers.get('user-agent') || ''
    ) as any

    const {
      client: { name: clientName },
      os: { name: osName },
    } = device

    const host = req.headers.get('host') // localhost:3000
    const protocol = req.headers.get('x-forwarded-proto') // http
    const url = `${protocol}://${host}`

    let ip = ''
    if (hasIp) {
      const { data } = await axios.get('https://api.ipify.org/?format=json')

      ip = data?.ip
    }

    return {
      clientName,
      osName,
      ip,
      url,
    }
  } catch (error: any) {
    throw {
      message: error?.message,
      status: 500,
    }
  }
}
