import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Prefer DIRECT TCP via DATABASE_URL
    url: process.env.DATABASE_URL!,
    // Optionally support shadow DB if present:
    // shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
})
