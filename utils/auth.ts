import jwt from 'jsonwebtoken'
import UserRole from '../models/UserRole'
import db from '../config/db'
import { IPermission } from '../models/Permission'

interface JwtPayload {
  id: string
}

export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

export const isAuth = async (
  req: NextApiRequestExtended,
  res: NextApiResponseExtended,
  next: any
) => {
  await db()
  let token = ''

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
      // req.user = await User.findById(decoded.id).select('-password')
      const userRole = await UserRole.findOne({ user: decoded.id }, { role: 1 })
        .populate({
          path: 'role',
          populate: {
            path: 'permission',
          },
        })
        .populate('user')

      req.user = userRole?.user

      const permissions = userRole?.role?.permission?.map(
        (per: IPermission) => ({
          route: per?.route,
          method: per?.method,
          auth: per?.auth,
        })
      )

      let { url, method } = req

      const urlArray = url.split('/')
      const lastIndex = urlArray.pop()

      const queryValue: any =
        Object.values(req.query)?.length > 0 && Object.values(req.query)[0]

      if (queryValue?.length === 24 && !lastIndex.includes('q')) {
        const queryKey = Object.keys(req.query)
        url = urlArray.join('/') + '/' + `:${queryKey[0]}`
      }

      if (url.includes('page')) {
        url = url.split('page')[0]

        if (url.includes('?')) {
          url = url.split('?')[0]
        }
      }
      if (
        permissions?.find(
          (permission: IPermission) =>
            permission.route === url &&
            permission.method === method &&
            permission.auth === false
        )
      ) {
        return next()
      }
      if (
        !permissions.find(
          (permission: IPermission) =>
            permission.route === url &&
            permission.method === method &&
            permission.auth === true
        )
      ) {
        return res
          .status(403)
          .send({ error: 'You do not have permission to access this route' })
      }

      next()
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token provided' })
  }
}
