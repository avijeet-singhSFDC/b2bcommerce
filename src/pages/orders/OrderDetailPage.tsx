import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrder } from '../../api/orders.api'
import { useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { PageSpinner } from '../../components/ui/Spinner'
import { ArrowLeft, RefreshCw, MapPin, CreditCard } from 'lucide-react'
import type { OrderStatus } from '../../types/order.types'

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { pushToast, setCartDrawerOpen } = useUiStore()

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId!),
    enabled: !!orderId,
  })

  async function handleReorder() {
    if (!order) return
    for (const item of order.items) {
      await addItem(item.productId, item.quantity)
    }
    pushToast('All items added to cart')
    setCartDrawerOpen(true)
  }

  if (isLoading) return <PageSpinner />
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Order not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h1>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Placed on {formatDate(order.placedAt)}</p>
        </div>
        <button onClick={handleReorder} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw size={16} /> Reorder All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><MapPin size={14} /> Ship To</div>
          <div className="text-sm text-gray-900 space-y-0.5">
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.street1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><CreditCard size={14} /> Payment</div>
          <div className="text-sm text-gray-900 space-y-0.5">
            <p className="font-medium">{order.paymentTerms}</p>
            {order.poNumber && <p className="text-gray-500">PO: {order.poNumber}</p>}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-gray-500 text-sm mb-2">Order Total</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(order.total)}</div>
          <div className="text-xs text-gray-500 mt-1">{order.items.reduce((s, i) => s + i.quantity, 0)} cases total</div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <img src={item.imageUrl} alt={item.productName} className="w-14 h-14 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/catalog/${item.productId}`} className="font-medium text-gray-900 hover:text-brand-600 truncate block">
                  {item.productName}
                </Link>
                <p className="text-xs text-gray-400 font-mono">{item.productSku}</p>
                <p className="text-sm text-gray-500 mt-0.5">{item.quantity} case{item.quantity > 1 ? 's' : ''} &times; {formatCurrency(item.pricePerCase)}</p>
              </div>
              <div className="font-semibold text-gray-900 flex-shrink-0">{formatCurrency(item.totalPrice)}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{order.shipping === 0 ? <span className="text-green-600">Free</span> : formatCurrency(order.shipping)}</span></div>
          <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-200"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
      </div>
    </div>
  )
}
