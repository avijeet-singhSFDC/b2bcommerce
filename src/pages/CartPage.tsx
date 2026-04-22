import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { CartItem } from '../components/cart/CartItem'
import { formatCurrency } from '../utils/currency'
import { PageSpinner } from '../components/ui/Spinner'
import { getRecommendations } from '../api/promotions.api'
import { getOrderedProductIds } from '../api/orders.api'
import { ProductCard, ProductCardSkeleton } from '../components/product/ProductCard'
import type { Product } from '../types/product.types'
import { History } from 'lucide-react'

export function CartPage() {
  const { cart, isLoading, fetchCart } = useCartStore()

  useEffect(() => { fetchCart() }, [])

  const cartProductIds = new Set(cart?.items.map(i => i.productId) ?? [])

  const { data: allRecommended = [], isLoading: recLoading } = useQuery({
    queryKey: ['recommended'],
    queryFn: getRecommendations,
  })

  const { data: orderedIds = [] } = useQuery({
    queryKey: ['orderedProductIds'],
    queryFn: getOrderedProductIds,
  })

  const orderedProductIds = new Set(orderedIds)
  const suggestions = allRecommended.filter(p => !cartProductIds.has(p.id)).slice(0, 4)

  if (isLoading && !cart) return <PageSpinner />

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <>
          <div className="card p-16 text-center">
            <ShoppingCart size={56} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mt-1 mb-6">Add products from the catalog to get started</p>
            <Link to="/catalog" className="btn-primary inline-flex">Browse Products</Link>
          </div>

          {/* Show recommendations even on empty cart */}
          <CartSuggestions products={suggestions} orderedProductIds={orderedProductIds} isLoading={recLoading} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map(item => <CartItem key={item.id} item={item} />)}
            </div>
            <div className="lg:col-span-1">
              <div className="card p-5 sticky top-20 space-y-4">
                <h2 className="font-semibold text-gray-900">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal ({cart.itemCount} items)</span><span>{formatCurrency(cart.subtotal)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="text-green-600 font-medium">Calculated at checkout</span></div>
                  <div className="flex justify-between text-gray-600"><span>Estimated Tax</span><span>{formatCurrency(cart.tax)}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100"><span>Total</span><span>{formatCurrency(cart.total)}</span></div>
                </div>
                <Link to="/checkout" className="btn-primary flex items-center justify-center gap-2 w-full">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
                <Link to="/catalog" className="btn-secondary flex items-center justify-center w-full text-sm">Continue Shopping</Link>
              </div>
            </div>
          </div>

          <CartSuggestions products={suggestions} orderedProductIds={orderedProductIds} isLoading={recLoading} />
        </>
      )}
    </div>
  )
}

function CartSuggestions({
  products,
  orderedProductIds,
  isLoading,
}: {
  products: Product[]
  orderedProductIds: Set<string>
  isLoading: boolean
}) {
  if (!isLoading && products.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} className="text-brand-500" />
        <h2 className="text-xl font-bold text-gray-900">You may also like</h2>
        <Link to="/catalog" className="ml-auto text-sm font-medium text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map(p => (
              <div key={p.id} className="relative">
                {orderedProductIds.has(p.id) && (
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-amber-200 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                    <History size={11} />
                    Previously ordered
                  </div>
                )}
                <ProductCard product={p} />
              </div>
            ))
        }
      </div>
    </div>
  )
}
