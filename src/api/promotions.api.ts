import { sfClient } from './client'
import type { Product } from '../types/product.types'
import type { PromotionBanner } from '../types/promotion.types'
import { SF_WEBSTORE_ID } from '../utils/constants'

export async function getHeroBanners(): Promise<PromotionBanner[]> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/promotions/banners`)
  return data
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/promotions/featured`)
  return data
}

export async function getRecommendations(): Promise<Product[]> {
  const { data } = await sfClient.get(`/webstores/${SF_WEBSTORE_ID}/promotions/recommendations`)
  return data
}
