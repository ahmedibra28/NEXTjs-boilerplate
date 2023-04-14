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
      const userRole = await UserRole.findOne({ user: decoded.id }, { role: 1 })
        .populate({
          path: 'role',
          select: 'permission',
          populate: {
            path: 'permission',
            select: ['method', 'route'],
          },
        })
        .populate('user', ['-password', '-createdAt', '-updatedAt'])
        .lean()

      req.user = userRole?.user

      const permissions = userRole?.role?.permission?.map(
        (per: IPermission) => ({
          route: per?.route,
          method: per?.method,
        })
      )

      let { url } = req

      if (req.query.id) {
        // api/path/:id
        const removedIDFromURL = url.replace(req.query.id, ':id')
        url = removedIDFromURL.split('?')?.[0]
      }

      if (url.includes('?')) {
        // api/path
        url = url.split('?')?.[0]
      }

      if (
        permissions?.find(
          (permission: IPermission) =>
            permission.route === url && permission.method === req.method
        )
      ) {
        return next()
      }

      return res
        .status(403)
        .send({ error: 'You do not have permission to access this route' })
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' })
    }
  }
  if (!token) {
    res.status(401).json({ error: 'No token provided' })
  }
}
