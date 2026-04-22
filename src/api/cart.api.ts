import { sfClient } from './client'
import type { Cart, CartItem } from '../types/cart.types'
import { SF_WEBSTORE_ID } from '../utils/constants'

export async function getCart(): Promise<Cart> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/carts/current`)
  return data
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const { data } = await sfClient.post(`/webstores/${SF_WEBSTORE_ID}/carts/current/cart-items`, { productId, quantity })
  return data
}

export async function updateCartItem(lineItemId: string, quantity: number): Promise<CartItem> {
  const { data } = await sfClient.patch(`/webstores/${SF_WEBSTORE_ID}/cart-items/${lineItemId}`, { quantity })
  return data
}

export async function removeCartItem(lineItemId: string): Promise<void> {
  await sfClient.delete(`/webstores/${SF_WEBSTORE_ID}/cart-items/${lineItemId}`)
}
