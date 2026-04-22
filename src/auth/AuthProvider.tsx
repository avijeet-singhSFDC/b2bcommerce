import { useState, useCallback, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthContextValue } from './AuthContext'
import type { BuyerUser } from '../types/auth.types'
import { getToken } from '../api/auth.api'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../utils/constants'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(AUTH_TOKEN_KEY))
  const [user, setUser] = useState<BuyerUser | null>(() => {
    const stored = sessionStorage.getItem(AUTH_USER_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (username: string, password: string) => {
    const { token: authToken, user: authUser } = await getToken(username, password)
    sessionStorage.setItem(AUTH_TOKEN_KEY, authToken.access_token)
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser))
    setToken(authToken.access_token)
    setUser(authUser)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
