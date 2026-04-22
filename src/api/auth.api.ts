import { sfClient } from './client'
import type { AuthToken, BuyerUser } from '../types/auth.types'

export async function getToken(username: string, password: string): Promise<{ token: AuthToken; user: BuyerUser }> {
  const { data } = await sfClient.post('/auth/token', { username, password })
  const mockUser: BuyerUser = {
    id: 'user001',
    username,
    firstName: 'John',
    lastName: 'Smith',
    email: `${username}@mainstreetgrocers.com`,
    accountId: 'acc001',
    accountName: 'Main Street Grocers',
    paymentTerms: 'Net 30',
  }
  return { token: data, user: mockUser }
}
