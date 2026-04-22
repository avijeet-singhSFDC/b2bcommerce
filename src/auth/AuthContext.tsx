import { createContext, useContext } from 'react'
import type { BuyerUser } from '../types/auth.types'

export interface AuthContextValue {
  token: string | null
  user: BuyerUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
