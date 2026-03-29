import { createAuthClient } from 'better-auth/client'
import { customSessionClient } from 'better-auth/client/plugins'
import type { auth } from './auth'

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>()],
})
