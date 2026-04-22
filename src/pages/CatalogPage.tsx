import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { searchProducts } from '../api/catalog.api'
import { ProductCard, ProductCardSkeleton } from '../components/product/ProductCard'
import { useDebounce } from '../hooks/useDebounce'

const CATEGORIES = [
  { id: 'cat-soda', name: 'Sodas' },
  { id: 'cat-energy', name: 'Energy Drinks' },
  { id: 'cat-water', name: 'Water' },
  { id: 'cat-juice', name: 'Juices & Lemonades' },
  { id: 'cat-mixer', name: 'Mixers' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const debouncedSearch = useDebounce(searchInput, 400)

  const q = searchParams.get('q') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const sortBy = searchParams.get('sortBy') || 'name'

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) params.set('q', debouncedSearch)
    else params.delete('q')
    setSearchParams(params, { replace: true })
  }, [debouncedSearch])

  const { data, isLoading } = useQuery({
    queryKey: ['products', q, categoryId, sortBy],
    queryFn: () => searchProducts({ q: q || undefined, categoryId: categoryId || undefined, sortBy: sortBy as never }),
  })

  function setCategory(id: string) {
    const params = new URLSearchParams(searchParams)
    if (id) params.set('categoryId', id)
    else params.delete('categoryId')
    setSearchParams(params)
  }

  function clearFilters() {
    setSearchInput('')
    setSearchParams({})
  }

  const hasFilters = q || categoryId

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          {data && <p className="text-sm text-gray-500 mt-0.5">{data.total} products found</p>}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Category</h3>
            <div className="space-y-1">
              <button
                onClick={() => setCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryId ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Products
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryId === cat.id ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + sort toolbar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => { const p = new URLSearchParams(searchParams); p.set('sortBy', e.target.value); setSearchParams(p) }}
              className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white hidden sm:block"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="lg:hidden btn-secondary flex items-center gap-2 text-sm py-2.5">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {/* Mobile filters */}
          {filtersOpen && (
            <div className="lg:hidden mb-4 p-4 card">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Category</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setCategory('')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!categoryId ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All</button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryId === cat.id ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{cat.name}</button>
                ))}
              </div>
            </div>
          )}

          {hasFilters && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-500">Filters:</span>
              {q && <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">"{q}" <button onClick={() => { setSearchInput(''); const p = new URLSearchParams(searchParams); p.delete('q'); setSearchParams(p) }}><X size={12} /></button></span>}
              {categoryId && <span className="bg-brand-100 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">{CATEGORIES.find(c => c.id === categoryId)?.name} <button onClick={() => setCategory('')}><X size={12} /></button></span>}
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">Clear all</button>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : data?.items.length === 0
                ? (
                  <div className="col-span-full text-center py-16 text-gray-400">
                    <Search size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No products found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                )
                : data?.items.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </div>
    </div>
  )
}
