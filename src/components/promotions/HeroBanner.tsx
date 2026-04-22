import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getHeroBanners } from '../../api/promotions.api'

export function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const { data: banners = [] } = useQuery({ queryKey: ['banners'], queryFn: getHeroBanners })

  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => setCurrent(c => (c + 1) % banners.length), 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  if (banners.length === 0) {
    return <div className="h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-brand-600 to-brand-800 animate-pulse rounded-2xl" />
  }

  const banner = banners[current]

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ minHeight: '280px' }}>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}

      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-10" style={{ minHeight: '280px' }}>
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{banner.title}</h1>
          <p className="text-white/90 text-sm sm:text-base mb-6">{banner.subtitle}</p>
          <Link
            to={banner.ctaLink}
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-sm"
          >
            {banner.ctaText}
          </Link>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrent(c => (c - 1 + banners.length) % banners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
            aria-label="Previous banner"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCurrent(c => (c + 1) % banners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white backdrop-blur-sm transition-colors"
            aria-label="Next banner"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
