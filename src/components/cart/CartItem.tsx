import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../../types/cart.types'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/currency'
import { QuantitySelector } from '../product/QuantitySelector'

export function CartItem({ item }: { item: CartItemType }) {
  const { updateItem, removeItem, isLoading } = useCartStore()

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-gray-100 bg-white">
      <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-50" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-mono">{item.productSku}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
        <p className="text-xs text-gray-500">{formatCurrency(item.pricePerCase)}/case</p>
        <div className="flex items-center justify-between mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => updateItem(item.id, qty)}
            disabled={isLoading}
            min={1}
          />
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-gray-900">{formatCurrency(item.totalPrice)}</span>
            <button
              onClick={() => removeItem(item.id)}
              disabled={isLoading}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
