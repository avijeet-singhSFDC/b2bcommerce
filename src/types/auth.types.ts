export interface AuthToken {
  access_token: string
  token_type: string
  expires_in: number
  issued_at?: number
}

export interface BuyerUser {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  accountId: string
  accountName: string
  paymentTerms: string
}

export interface AuthState {
  token: string | null
  user: BuyerUser | null
  isAuthenticated: boolean
}
