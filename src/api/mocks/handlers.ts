import { http, HttpResponse, delay } from 'msw'
import { MOCK_PRODUCTS, FEATURED_PRODUCTS, PROMOTED_PRODUCTS, MOCK_BANNERS } from './data/products.mock'
import { MOCK_ORDERS, MOCK_ORDER_SUMMARIES, PRODUCT_ORDER_HISTORY } from './data/orders.mock'
import { MOCK_EQUIPMENT_TICKETS, MOCK_CS_TICKETS, MOCK_TICKET_DETAILS } from './data/tickets.mock'

const LATENCY = 400

let mockCart = {
  id: 'cart001',
  accountId: 'acc001',
  items: [] as Array<{ id: string; productId: string; productName: string; productSku: string; imageUrl: string; quantity: number; pricePerCase: number; totalPrice: number; currency: string }>,
  subtotal: 0,
  tax: 0,
  total: 0,
  currency: 'USD',
  itemCount: 0,
}

function recalcCart() {
  mockCart.subtotal = mockCart.items.reduce((s, i) => s + i.totalPrice, 0)
  mockCart.tax = parseFloat((mockCart.subtotal * 0.09).toFixed(2))
  mockCart.total = parseFloat((mockCart.subtotal + mockCart.tax).toFixed(2))
  mockCart.itemCount = mockCart.items.reduce((s, i) => s + i.quantity, 0)
}

export const handlers = [
  // Auth
  http.post('*/auth/token', async () => {
    await delay(LATENCY)
    return HttpResponse.json({
      access_token: 'mock_token_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      issued_at: Date.now(),
    })
  }),

  // Products
  http.get('*/webstores/:storeId/search/product-search', async ({ request }) => {
    await delay(LATENCY)
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase()
    const categoryId = url.searchParams.get('categoryId')
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12')

    let results = [...MOCK_PRODUCTS]
    if (q) results = results.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    if (categoryId) results = results.filter(p => p.categoryId === categoryId)

    const start = (page - 1) * pageSize
    return HttpResponse.json({
      items: results.slice(start, start + pageSize),
      total: results.length,
      page,
      pageSize,
      facets: [
        { id: 'category', name: 'Category', values: [
          { value: 'cat-soda', label: 'Sodas', count: MOCK_PRODUCTS.filter(p => p.categoryId === 'cat-soda').length },
          { value: 'cat-energy', label: 'Energy Drinks', count: MOCK_PRODUCTS.filter(p => p.categoryId === 'cat-energy').length },
          { value: 'cat-water', label: 'Water', count: MOCK_PRODUCTS.filter(p => p.categoryId === 'cat-water').length },
          { value: 'cat-juice', label: 'Juices & Lemonades', count: MOCK_PRODUCTS.filter(p => p.categoryId === 'cat-juice').length },
          { value: 'cat-mixer', label: 'Mixers', count: MOCK_PRODUCTS.filter(p => p.categoryId === 'cat-mixer').length },
        ]},
      ],
    })
  }),

  http.get('*/webstores/:storeId/products/:productId', async ({ params }) => {
    await delay(LATENCY)
    const product = MOCK_PRODUCTS.find(p => p.id === params.productId)
    if (!product) return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
    return HttpResponse.json(product)
  }),

  // Promotions
  http.get('*/webstores/:storeId/promotions/banners', async () => {
    await delay(LATENCY)
    return HttpResponse.json(MOCK_BANNERS)
  }),

  http.get('*/webstores/:storeId/promotions/featured', async () => {
    await delay(LATENCY)
    return HttpResponse.json(FEATURED_PRODUCTS)
  }),

  http.get('*/webstores/:storeId/promotions/recommendations', async () => {
    await delay(LATENCY)
    return HttpResponse.json(PROMOTED_PRODUCTS)
  }),

  // Cart
  http.get('*/webstores/:storeId/carts/current', async () => {
    await delay(LATENCY)
    return HttpResponse.json(mockCart)
  }),

  http.post('*/webstores/:storeId/carts/current/cart-items', async ({ request }) => {
    await delay(LATENCY)
    const body = await request.json() as { productId: string; quantity: number }
    const product = MOCK_PRODUCTS.find(p => p.id === body.productId)
    if (!product) return HttpResponse.json({ message: 'Product not found' }, { status: 404 })

    const existing = mockCart.items.find(i => i.productId === body.productId)
    if (existing) {
      existing.quantity += body.quantity
      existing.totalPrice = parseFloat((existing.quantity * existing.pricePerCase).toFixed(2))
    } else {
      mockCart.items.push({
        id: 'li_' + Date.now(),
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        imageUrl: product.imageUrl,
        quantity: body.quantity,
        pricePerCase: product.pricePerCase,
        totalPrice: parseFloat((body.quantity * product.pricePerCase).toFixed(2)),
        currency: 'USD',
      })
    }
    recalcCart()
    return HttpResponse.json(mockCart, { status: 201 })
  }),

  http.patch('*/webstores/:storeId/cart-items/:itemId', async ({ params, request }) => {
    await delay(LATENCY)
    const body = await request.json() as { quantity: number }
    const item = mockCart.items.find(i => i.id === params.itemId)
    if (!item) return HttpResponse.json({ message: 'Item not found' }, { status: 404 })
    item.quantity = body.quantity
    item.totalPrice = parseFloat((item.quantity * item.pricePerCase).toFixed(2))
    recalcCart()
    return HttpResponse.json(item)
  }),

  http.delete('*/webstores/:storeId/cart-items/:itemId', async ({ params }) => {
    await delay(LATENCY)
    mockCart.items = mockCart.items.filter(i => i.id !== params.itemId)
    recalcCart()
    return new HttpResponse(null, { status: 204 })
  }),

  // Checkout
  http.post('*/webstores/:storeId/checkouts', async () => {
    await delay(LATENCY)
    return HttpResponse.json({
      id: 'chk_' + Date.now(),
      cartId: mockCart.id,
      status: 'address',
      subtotal: mockCart.subtotal,
      tax: mockCart.tax,
      shipping: 0,
      total: mockCart.total,
    }, { status: 201 })
  }),

  http.post('*/webstores/:storeId/checkouts/:checkoutId/orders', async () => {
    await delay(LATENCY * 2)
    const orderId = 'ord_' + Date.now()
    mockCart.items = []
    recalcCart()
    return HttpResponse.json({ id: orderId, orderNumber: 'FD-2026-' + Math.floor(Math.random() * 9000 + 1000) }, { status: 201 })
  }),

  http.get('*/webstores/:storeId/shipping-methods', async () => {
    await delay(LATENCY)
    return HttpResponse.json([
      { id: 'ship001', name: 'Standard Delivery', description: '5-7 business days', estimatedDays: 7, cost: 0 },
      { id: 'ship002', name: 'Express Delivery', description: '2-3 business days', estimatedDays: 3, cost: 25 },
      { id: 'ship003', name: 'Next Day Delivery', description: 'Next business day', estimatedDays: 1, cost: 65 },
    ])
  }),

  // Orders
  http.get('*/webstores/:storeId/order-summaries', async ({ request }) => {
    await delay(LATENCY)
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    let results = [...MOCK_ORDER_SUMMARIES]
    if (status) results = results.filter(o => o.status === status)
    return HttpResponse.json({ items: results, total: results.length, page: 1, pageSize: 20 })
  }),

  http.get('*/webstores/:storeId/order-summaries/:orderId', async ({ params }) => {
    await delay(LATENCY)
    const order = MOCK_ORDERS.find(o => o.id === params.orderId)
    if (!order) return HttpResponse.json({ message: 'Order not found' }, { status: 404 })
    return HttpResponse.json(order)
  }),

  http.get('*/webstores/:storeId/products/:productId/order-history', async ({ params }) => {
    await delay(LATENCY)
    const history = PRODUCT_ORDER_HISTORY[params.productId as string] || []
    return HttpResponse.json(history)
  }),

  http.get('*/webstores/:storeId/ordered-product-ids', async () => {
    await delay(LATENCY)
    const ids = [...new Set(MOCK_ORDERS.flatMap(o => o.items.map(i => i.productId)))]
    return HttpResponse.json(ids)
  }),

  // Service Tickets
  http.get('*/cases', async ({ request }) => {
    await delay(LATENCY)
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    let results = [...MOCK_EQUIPMENT_TICKETS as Array<typeof MOCK_EQUIPMENT_TICKETS[0] | typeof MOCK_CS_TICKETS[0]>, ...MOCK_CS_TICKETS]
    if (type === 'equipment') results = MOCK_EQUIPMENT_TICKETS
    else if (type === 'customer_service') results = MOCK_CS_TICKETS
    return HttpResponse.json({ items: results, total: results.length, page: 1, pageSize: 20 })
  }),

  http.get('*/cases/:ticketId', async ({ params }) => {
    await delay(LATENCY)
    const detail = MOCK_TICKET_DETAILS[params.ticketId as string]
    if (!detail) {
      const ticket = [...MOCK_EQUIPMENT_TICKETS, ...MOCK_CS_TICKETS].find(t => t.id === params.ticketId)
      if (!ticket) return HttpResponse.json({ message: 'Ticket not found' }, { status: 404 })
      return HttpResponse.json({ ...ticket, comments: [], attachments: [] })
    }
    return HttpResponse.json(detail)
  }),

  http.post('*/cases', async ({ request }) => {
    await delay(LATENCY)
    const body = await request.json() as Record<string, unknown>
    return HttpResponse.json({
      id: 'ticket_' + Date.now(),
      ticketNumber: (body.type === 'equipment' ? 'EQ' : 'CS') + '-2026-' + Math.floor(Math.random() * 9000 + 1000),
      status: 'open',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accountId: 'acc001',
      contactName: 'John Smith',
    }, { status: 201 })
  }),

  http.post('*/cases/:ticketId/comments', async ({ params, request }) => {
    await delay(LATENCY)
    const body = await request.json() as { content: string }
    return HttpResponse.json({
      id: 'comment_' + Date.now(),
      author: 'John Smith',
      authorRole: 'customer',
      content: body.content,
      createdAt: new Date().toISOString(),
      ticketId: params.ticketId,
    }, { status: 201 })
  }),
]
