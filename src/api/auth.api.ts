import { sfClient } from './client'
import type { AuthToken, BuyerUser } from '../types/auth.types'

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'
const NO_SF_URL = !import.meta.env.VITE_SF_BASE_URL || import.meta.env.VITE_SF_BASE_URL === 'https://mock.flashydrinks.com'

function mockAuthResponse(username: string): { token: AuthToken; user: BuyerUser } {
  return {
    token: {
      access_token: 'demo_token_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      issued_at: Date.now(),
    },
    user: {
      id: 'user001',
      username,
      firstName: 'John',
      lastName: 'Smith',
      email: username,
      accountId: 'acc001',
      accountName: 'Main Street Grocers',
      paymentTerms: 'Net 30',
    },
  }
}

export async function getToken(username: string, password: string): Promise<{ token: AuthToken; user: BuyerUser }> {
  if (USE_MOCKS || NO_SF_URL) {
    return mockAuthResponse(username)
  }
  const { data } = await sfClient.post('/auth/token', { username, password })
  const user: BuyerUser = {
    id: data.userId,
    username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: username,
    accountId: data.accountId,
    accountName: data.accountName,
    paymentTerms: data.paymentTerms ?? 'Net 30',
  }
  return { token: data, user }
}
