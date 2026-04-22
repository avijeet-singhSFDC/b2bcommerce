export interface Product {
  id: string
  name: string
  sku: string
  description: string
  imageUrl: string
  images: string[]
  pricePerCase: number
  pricePerUnit: number
  unitsPerCase: number
  currency: string
  categoryId: string
  categoryName: string
  brand: string
  packSize: string
  inStock: boolean
  stockLevel: number
  isFeatured: boolean
  isPromoted: boolean
  badges: ProductBadge[]
}

export type ProductBadge = 'new' | 'featured' | 'low-stock' | 'best-seller' | 'promo'

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
}

export interface ProductSearchParams {
  q?: string
  categoryId?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'newest'
  page?: number
  pageSize?: number
}

export interface Facet {
  id: string
  name: string
  values: FacetValue[]
}

export interface FacetValue {
  value: string
  label: string
  count: number
}

export interface ProductSearchResult {
  items: Product[]
  total: number
  page: number
  pageSize: number
  facets: Facet[]
}
