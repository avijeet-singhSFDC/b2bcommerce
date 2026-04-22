import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency } from '../../utils/currency'
import { CartItem } from './CartItem'

export function CartDrawer() {
  const { cartDrawerOpen, setCartDrawerOpen } = useUiStore()
  const { cart, fetchCart } = useCartStore()

  useEffect(() => {
    if (cartDrawerOpen && !cart) fetchCart()
  }, [cartDrawerOpen, cart, fetchCart])

  if (!cartDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => setCartDrawerOpen(false)} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-brand-600" />
            <h2 className="font-semibold text-gray-900">Shopping Cart</h2>
            {cart && cart.itemCount > 0 && (
              <span className="bg-brand-100 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {cart.itemCount} items
              </span>
            )}
          </div>
          <button onClick={() => setCartDrawerOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Browse our catalog to add products</p>
              <Link
                to="/catalog"
                onClick={() => setCartDrawerOpen(false)}
                className="mt-4 btn-primary text-sm"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart.items.map(item => <CartItem key={item.id} item={item} />)
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (estimated)</span>
                <span>{formatCurrency(cart.tax)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartDrawerOpen(false)}
              className="btn-primary flex items-center justify-center gap-2 w-full"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/cart"
              onClick={() => setCartDrawerOpen(false)}
              className="btn-secondary flex items-center justify-center gap-2 w-full text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
