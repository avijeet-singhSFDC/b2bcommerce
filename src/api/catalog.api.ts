import { sfClient } from './client'
import type { Product, ProductSearchParams, ProductSearchResult } from '../types/product.types'
import { SF_WEBSTORE_ID } from '../utils/constants'

export async function searchProducts(params: ProductSearchParams): Promise<ProductSearchResult> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/search/product-search`, { params })
  return data
}

export async function getProduct(productId: string): Promise<Product> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/products/${productId}`)
  return data
}
