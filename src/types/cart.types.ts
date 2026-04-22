export interface CartItem {
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

export interface Cart {
  id: string
  accountId: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  itemCount: number
}
