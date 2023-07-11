export interface IUser {
  id?: string
  email: string
  name: string
  image?: string | null
  mobile?: number | null
  address?: string | null
  bio?: string | null
  password: string
  confirmed?: boolean
  blocked?: boolean
  resetPasswordToken?: string | null
  resetPasswordExpire?: bigint | number | null
  createdAt?: Date | string
  updatedAt?: Date | string
  roleId: number
  role: IRole
}

export interface IRole {
  id?: string
  name: string
  type: string
  description?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  users?: IUser[]
  permissions?: IPermission[]
  clientPermissions?: IClientPermission[]
}

export interface IPermission {
  id?: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  route: string
  description?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  role?: IRole
}

export interface IClientPermission {
  id?: string
  name: string
  sort: number
  menu: string
  path: string
  description?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  role?: IRole
}
