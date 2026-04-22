import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRecommendations } from '../../api/promotions.api'
import { ProductCard, ProductCardSkeleton } from '../product/ProductCard'

export function RecommendedProducts() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ['recommended'], queryFn: getRecommendations })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
        <Link to="/catalog" className="text-sm font-medium text-brand-600 hover:text-brand-700">View all</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>
    </div>
  )
}
