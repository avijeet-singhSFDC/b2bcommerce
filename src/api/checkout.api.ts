import { sfClient } from './client'
import type { Checkout, ShippingMethod, Order, Address } from '../types/order.types'
import { SF_WEBSTORE_ID } from '../utils/constants'

export async function createCheckout(cartId: string): Promise<Checkout> {
  const { data } = await sfClient.post(`/webstores/${SF_WEBSTORE_ID}/checkouts`, { cartId })
  return data
}

export async function updateCheckout(checkoutId: string, payload: Partial<Checkout>): Promise<Checkout> {
  const { data } = await sfClient.patch(`/webstores/${SF_WEBSTORE_ID}/checkouts/${checkoutId}`, payload)
  return data
}

export async function updateAddress(checkoutId: string, address: Address, type: 'shipping' | 'billing'): Promise<Checkout> {
  return updateCheckout(checkoutId, type === 'shipping' ? { shippingAddress: address } : { billingAddress: address })
}

export async function getShippingMethods(checkoutId: string): Promise<ShippingMethod[]> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/shipping-methods`, { params: { checkoutId } })
  return data
}

export async function placeOrder(checkoutId: string): Promise<Order> {
  const { data } = await sfClient.post(`/webstores/${SF_WEBSTORE_ID}/checkouts/${checkoutId}/orders`)
  return data
}
