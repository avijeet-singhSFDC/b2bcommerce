import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, ClipboardList } from 'lucide-react'

export function OrderConfirmationPage() {
  const location = useLocation()
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber || 'FD-2026-NEW'

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="card p-10 space-y-5">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Placed!</h1>
          <p className="text-gray-500 mt-1">Your order <strong className="text-gray-700">{orderNumber}</strong> has been confirmed.</p>
        </div>
        <p className="text-sm text-gray-500">An invoice will be sent to your account email. You'll receive a shipping notification once your order is dispatched.</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link to="/orders" className="btn-primary flex items-center justify-center gap-2 flex-1">
            <ClipboardList size={16} /> View Orders
          </Link>
          <Link to="/catalog" className="btn-secondary flex items-center justify-center gap-2 flex-1">
            <Package size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
