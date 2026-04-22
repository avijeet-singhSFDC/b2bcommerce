import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../../api/orders.api'
import type { OrderStatus } from '../../types/order.types'
import { formatCurrency } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { PageSpinner } from '../../components/ui/Spinner'

const STATUS_FILTERS: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export function OrderHistoryPage() {
  const [status, setStatus] = useState<OrderStatus | ''>('')
  const { data, isLoading } = useQuery({
    queryKey: ['orders', status],
    queryFn: () => getOrders({ status: status || undefined }),
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          {data && <p className="text-sm text-gray-500 mt-0.5">{data.total} orders</p>}
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${status === f.value ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? <PageSpinner /> : (
        !data || data.items.length === 0 ? (
          <div className="card p-16 text-center">
            <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-700">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.items.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow block">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.placedAt)} &bull; {order.itemCount} items</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-gray-900">{formatCurrency(order.total)}</div>
                </div>
                <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
