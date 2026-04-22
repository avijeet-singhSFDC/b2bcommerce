import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, ArrowLeft, BarChart2, TrendingUp } from 'lucide-react'
import { getProduct } from '../api/catalog.api'
import { getProductOrderHistory } from '../api/orders.api'
import { useCartStore } from '../store/cartStore'
import { useUiStore } from '../store/uiStore'
import { formatCurrency } from '../utils/currency'
import { QuantitySelector } from '../components/product/QuantitySelector'
import { RecommendedProducts } from '../components/promotions/RecommendedProducts'
import { PageSpinner } from '../components/ui/Spinner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [showHistory, setShowHistory] = useState(false)
  const { addItem, isLoading: cartLoading } = useCartStore()
  const { pushToast, setCartDrawerOpen } = useUiStore()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId,
  })

  const { data: history = [] } = useQuery({
    queryKey: ['productHistory', productId],
    queryFn: () => getProductOrderHistory(productId!),
    enabled: !!productId && showHistory,
  })

  async function handleAddToCart() {
    if (!product) return
    await addItem(product.id, qty)
    pushToast(`${qty} case${qty > 1 ? 's' : ''} of ${product.name} added to cart`)
    setCartDrawerOpen(true)
  }

  if (isLoading) return <PageSpinner />
  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-500">Product not found.</p>
      <Link to="/catalog" className="btn-primary mt-4 inline-flex">Back to Catalog</Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.badges.includes('featured') && <span className="bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Featured</span>}
              {product.badges.includes('new') && <span className="bg-accent-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">New</span>}
              {product.badges.includes('best-seller') && <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><TrendingUp size={10} /> Best Seller</span>}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-400 text-sm font-mono mt-1">SKU: {product.sku}</p>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
            <div><span className="text-gray-500">Category</span><p className="font-medium mt-0.5">{product.categoryName}</p></div>
            <div><span className="text-gray-500">Pack Size</span><p className="font-medium mt-0.5">{product.packSize}</p></div>
            <div><span className="text-gray-500">Units/Case</span><p className="font-medium mt-0.5">{product.unitsPerCase}</p></div>
            <div><span className="text-gray-500">Availability</span><p className={`font-medium mt-0.5 ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</p></div>
          </div>

          <div className="py-4 border-t border-b border-gray-100 space-y-1">
            <div className="text-3xl font-bold text-gray-900">{formatCurrency(product.pricePerCase)}<span className="text-lg font-normal text-gray-500"> / case</span></div>
            <div className="text-sm text-gray-500">{formatCurrency(product.pricePerUnit)} per unit</div>
          </div>

          {product.inStock ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <QuantitySelector value={qty} onChange={setQty} disabled={cartLoading} />
              <button onClick={handleAddToCart} disabled={cartLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <button disabled className="btn-secondary w-full opacity-60 cursor-not-allowed">Out of Stock</button>
          )}

          {/* Order history toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            <BarChart2 size={16} />
            {showHistory ? 'Hide' : 'View'} order history for this product
          </button>

          {showHistory && history.length > 0 && (
            <div className="card p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-4">Cases Ordered — Last 6 Months</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`${v} cases`, 'Qty']} />
                  <Bar dataKey="totalQty" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {showHistory && history.length === 0 && (
            <div className="text-sm text-gray-400 italic">No order history available for this product.</div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <RecommendedProducts />
      </div>
    </div>
  )
}
