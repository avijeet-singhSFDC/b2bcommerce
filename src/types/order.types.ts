export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderLineItem {
  id: string
  productId: string
  productName: string
  productSku: string
  imageUrl: string
  quantity: number
  pricePerCase: number
  totalPrice: number
  currency: string
}

export interface Address {
  name: string
  street1: string
  street2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  placedAt: string
  deliveredAt?: string
  items: OrderLineItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  poNumber?: string
  paymentTerms: string
  accountId: string
}

export interface OrderSummary {
  id: string
  orderNumber: string
  status: OrderStatus
  placedAt: string
  total: number
  currency: string
  itemCount: number
}

export interface OrderListParams {
  status?: OrderStatus
  dateFrom?: string
  dateTo?: string
  q?: string
  page?: number
  pageSize?: number
}

export interface OrderListResult {
  items: OrderSummary[]
  total: number
  page: number
  pageSize: number
}

export interface ProductOrderHistory {
  month: string
  year: number
  totalQty: number
  orderCount: number
}

export interface Checkout {
  id: string
  cartId: string
  status: 'draft' | 'address' | 'shipping' | 'payment' | 'review'
  shippingAddress?: Address
  billingAddress?: Address
  shippingMethodId?: string
  shippingMethodName?: string
  shippingCost?: number
  poNumber?: string
  paymentTerms?: string
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  estimatedDays: number
  cost: number
}
