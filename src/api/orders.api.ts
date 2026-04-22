import { sfClient } from './client'
import type { Order, OrderListParams, OrderListResult, ProductOrderHistory } from '../types/order.types'
import { SF_WEBSTORE_ID } from '../utils/constants'

export async function getOrders(params: OrderListParams): Promise<OrderListResult> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/order-summaries`, { params })
  return data
}

export async function getOrder(orderId: string): Promise<Order> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/order-summaries/${orderId}`)
  return data
}

export async function getProductOrderHistory(productId: string): Promise<ProductOrderHistory[]> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/products/${productId}/order-history`)
  return data
}

export async function getOrderedProductIds(): Promise<string[]> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/ordered-product-ids`)
  return data
}
