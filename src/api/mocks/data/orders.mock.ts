import type { Order, OrderSummary, ProductOrderHistory } from '../../../types/order.types'

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord001', orderNumber: 'FD-2026-0421', status: 'delivered',
    placedAt: '2026-04-01T10:00:00Z', deliveredAt: '2026-04-05T14:30:00Z',
    items: [
      { id: 'li001', productId: 'p001', productName: 'Flashy Cola Original', productSku: 'FC-COLA-24', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80', quantity: 10, pricePerCase: 24.99, totalPrice: 249.90, currency: 'USD' },
      { id: 'li002', productId: 'p003', productName: 'Flashy Energy Burst', productSku: 'FE-BURST-24', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', quantity: 5, pricePerCase: 39.99, totalPrice: 199.95, currency: 'USD' },
      { id: 'li003', productId: 'p005', productName: 'Flashy Sparkling Water Plain', productSku: 'FS-WATER-PLAIN-24', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', quantity: 8, pricePerCase: 18.99, totalPrice: 151.92, currency: 'USD' },
    ],
    shippingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    billingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 601.77, tax: 54.16, shipping: 0, total: 655.93, currency: 'USD',
    poNumber: 'PO-2026-041', paymentTerms: 'Net 30', accountId: 'acc001',
  },
  {
    id: 'ord002', orderNumber: 'FD-2026-0389', status: 'shipped',
    placedAt: '2026-04-15T09:00:00Z',
    items: [
      { id: 'li004', productId: 'p001', productName: 'Flashy Cola Original', productSku: 'FC-COLA-24', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80', quantity: 20, pricePerCase: 24.99, totalPrice: 499.80, currency: 'USD' },
      { id: 'li005', productId: 'p007', productName: 'Flashy Lemonade Classic', productSku: 'FL-LEM-12', imageUrl: 'https://images.unsplash.com/photo-1498429152472-9a433d9ddf3b?w=400&q=80', quantity: 10, pricePerCase: 22.99, totalPrice: 229.90, currency: 'USD' },
    ],
    shippingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    billingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 729.70, tax: 65.67, shipping: 0, total: 795.37, currency: 'USD',
    poNumber: 'PO-2026-052', paymentTerms: 'Net 30', accountId: 'acc001',
  },
  {
    id: 'ord003', orderNumber: 'FD-2026-0310', status: 'delivered',
    placedAt: '2026-03-10T11:00:00Z', deliveredAt: '2026-03-14T16:00:00Z',
    items: [
      { id: 'li006', productId: 'p001', productName: 'Flashy Cola Original', productSku: 'FC-COLA-24', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80', quantity: 15, pricePerCase: 24.99, totalPrice: 374.85, currency: 'USD' },
      { id: 'li007', productId: 'p002', productName: 'Flashy Cola Zero Sugar', productSku: 'FC-COLA-ZERO-24', imageUrl: 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=400&q=80', quantity: 8, pricePerCase: 25.49, totalPrice: 203.92, currency: 'USD' },
    ],
    shippingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    billingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 578.77, tax: 52.09, shipping: 25.00, total: 655.86, currency: 'USD',
    poNumber: 'PO-2026-031', paymentTerms: 'Net 30', accountId: 'acc001',
  },
  {
    id: 'ord004', orderNumber: 'FD-2026-0255', status: 'delivered',
    placedAt: '2026-02-18T08:30:00Z', deliveredAt: '2026-02-22T12:00:00Z',
    items: [
      { id: 'li008', productId: 'p003', productName: 'Flashy Energy Burst', productSku: 'FE-BURST-24', imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', quantity: 12, pricePerCase: 39.99, totalPrice: 479.88, currency: 'USD' },
      { id: 'li009', productId: 'p005', productName: 'Flashy Sparkling Water Plain', productSku: 'FS-WATER-PLAIN-24', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', quantity: 20, pricePerCase: 18.99, totalPrice: 379.80, currency: 'USD' },
    ],
    shippingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    billingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 859.68, tax: 77.37, shipping: 0, total: 937.05, currency: 'USD',
    poNumber: 'PO-2026-021', paymentTerms: 'Net 30', accountId: 'acc001',
  },
  {
    id: 'ord005', orderNumber: 'FD-2026-0198', status: 'processing',
    placedAt: '2026-04-20T14:00:00Z',
    items: [
      { id: 'li010', productId: 'p001', productName: 'Flashy Cola Original', productSku: 'FC-COLA-24', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80', quantity: 30, pricePerCase: 24.99, totalPrice: 749.70, currency: 'USD' },
    ],
    shippingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    billingAddress: { name: 'Main Street Grocers', street1: '123 Main St', city: 'Chicago', state: 'IL', postalCode: '60601', country: 'US' },
    subtotal: 749.70, tax: 67.47, shipping: 0, total: 817.17, currency: 'USD',
    poNumber: 'PO-2026-059', paymentTerms: 'Net 30', accountId: 'acc001',
  },
]

export const MOCK_ORDER_SUMMARIES: OrderSummary[] = MOCK_ORDERS.map(o => ({
  id: o.id,
  orderNumber: o.orderNumber,
  status: o.status,
  placedAt: o.placedAt,
  total: o.total,
  currency: o.currency,
  itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
}))

export const PRODUCT_ORDER_HISTORY: Record<string, ProductOrderHistory[]> = {
  p001: [
    { month: 'Nov', year: 2025, totalQty: 25, orderCount: 2 },
    { month: 'Dec', year: 2025, totalQty: 35, orderCount: 3 },
    { month: 'Jan', year: 2026, totalQty: 20, orderCount: 2 },
    { month: 'Feb', year: 2026, totalQty: 28, orderCount: 2 },
    { month: 'Mar', year: 2026, totalQty: 15, orderCount: 1 },
    { month: 'Apr', year: 2026, totalQty: 50, orderCount: 2 },
  ],
  p003: [
    { month: 'Nov', year: 2025, totalQty: 8, orderCount: 1 },
    { month: 'Dec', year: 2025, totalQty: 12, orderCount: 1 },
    { month: 'Jan', year: 2026, totalQty: 10, orderCount: 1 },
    { month: 'Feb', year: 2026, totalQty: 12, orderCount: 1 },
    { month: 'Mar', year: 2026, totalQty: 0, orderCount: 0 },
    { month: 'Apr', year: 2026, totalQty: 5, orderCount: 1 },
  ],
}
