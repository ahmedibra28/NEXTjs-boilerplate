import { Schema, model, models } from 'mongoose'

export interface IClientPermission {
  _id: Schema.Types.ObjectId
  name: string
  sort: number
  menu: string
  path: string
  description?: boolean
  createdAt?: Date
}

const ClientPermissionSchema = new Schema<IClientPermission>(
  {
    name: { type: String, required: true },
    sort: { type: Number, required: true },
    menu: { type: String, required: true },
    path: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
)

const ClientPermission =
  models.ClientPermission || model('ClientPermission', ClientPermissionSchema)

export default ClientPermission
