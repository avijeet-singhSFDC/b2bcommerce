import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getFeaturedProducts } from '../../api/promotions.api'
import { ProductCard, ProductCardSkeleton } from '../product/ProductCard'

export function FeaturedProductsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data: products = [], isLoading } = useQuery({ queryKey: ['featured'], queryFn: getFeaturedProducts })

  function scroll(dir: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors" aria-label="Scroll left">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors" aria-label="Scroll right">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[240px] snap-start"><ProductCardSkeleton /></div>
            ))
          : products.map(p => (
              <div key={p.id} className="min-w-[240px] snap-start"><ProductCard product={p} /></div>
            ))
        }
      </div>
    </div>
  )
}
