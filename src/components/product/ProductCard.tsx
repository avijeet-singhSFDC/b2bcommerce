import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, TrendingUp } from 'lucide-react'
import type { Product } from '../../types/product.types'
import { useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'
import { formatCurrency } from '../../utils/currency'
import { QuantitySelector } from './QuantitySelector'

export function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const { addItem, isLoading } = useCartStore()
  const { pushToast, setCartDrawerOpen } = useUiStore()

  async function handleAddToCart() {
    await addItem(product.id, qty)
    pushToast(`${qty} case${qty > 1 ? 's' : ''} of ${product.name} added to cart`)
    setCartDrawerOpen(true)
    setQty(1)
  }

  return (
    <div className="card flex flex-col overflow-hidden group hover:shadow-md transition-shadow">
      <Link to={`/catalog/${product.id}`} className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badges.includes('featured') && (
            <span className="bg-brand-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Featured</span>
          )}
          {product.badges.includes('new') && (
            <span className="bg-accent-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">New</span>
          )}
          {product.badges.includes('promo') && (
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Promo</span>
          )}
          {product.badges.includes('best-seller') && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={10} /> Best Seller
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
          <Link to={`/catalog/${product.id}`} className="hover:text-brand-600 transition-colors">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight mt-0.5">{product.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1">{product.packSize}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(product.pricePerCase)}</div>
            <div className="text-xs text-gray-500">per case &bull; {formatCurrency(product.pricePerUnit)}/unit</div>
          </div>
        </div>

        {product.inStock ? (
          <div className="flex flex-col gap-2">
            <QuantitySelector value={qty} onChange={setQty} disabled={isLoading} />
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2 text-sm py-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        ) : (
          <button disabled className="btn-secondary text-sm py-2 opacity-60 cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/2" />
        <div className="h-9 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
