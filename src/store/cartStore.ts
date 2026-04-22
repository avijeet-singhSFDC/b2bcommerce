import { create } from 'zustand'
import type { Cart, CartItem } from '../types/cart.types'
import * as cartApi from '../api/cart.api'

interface CartStore {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  clearError: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartApi.getCart()
      set({ cart, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Failed to load cart' })
    }
  },

  addItem: async (productId: string, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const cart = await cartApi.addToCart(productId, quantity)
      set({ cart, isLoading: false })
    } catch {
      set({ isLoading: false, error: 'Failed to add item' })
    }
  },

  updateItem: async (lineItemId: string, quantity: number) => {
    if (quantity <= 0) {
      return get().removeItem(lineItemId)
    }
    try {
      await cartApi.updateCartItem(lineItemId, quantity)
      await get().fetchCart()
    } catch {
      set({ error: 'Failed to update item' })
    }
  },

  removeItem: async (lineItemId: string) => {
    const currentCart = get().cart
    if (currentCart) {
      set({ cart: { ...currentCart, items: currentCart.items.filter((i: CartItem) => i.id !== lineItemId) } })
    }
    try {
      await cartApi.removeCartItem(lineItemId)
      await get().fetchCart()
    } catch {
      set({ error: 'Failed to remove item', cart: currentCart })
    }
  },

  clearError: () => set({ error: null }),
}))
