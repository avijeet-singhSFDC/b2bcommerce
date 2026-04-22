import axios from 'axios'
import { SF_BASE_URL, AUTH_TOKEN_KEY } from '../utils/constants'

export const sfClient = axios.create({
  baseURL: SF_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

sfClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

sfClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
      window.location.href = '/login'
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errorCode ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)
