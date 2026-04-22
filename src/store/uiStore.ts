import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UiStore {
  mobileMenuOpen: boolean
  cartDrawerOpen: boolean
  toasts: Toast[]
  setMobileMenuOpen: (open: boolean) => void
  setCartDrawerOpen: (open: boolean) => void
  pushToast: (message: string, type?: Toast['type']) => void
  dismissToast: (id: string) => void
}

export const useUiStore = create<UiStore>((set) => ({
  mobileMenuOpen: false,
  cartDrawerOpen: false,
  toasts: [],

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),

  pushToast: (message, type = 'success') => {
    const id = Date.now().toString()
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })), 4000)
  },

  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))
