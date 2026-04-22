import { HeroBanner } from '../components/promotions/HeroBanner'
import { FeaturedProductsCarousel } from '../components/promotions/FeaturedProductsCarousel'
import { RecommendedProducts } from '../components/promotions/RecommendedProducts'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Package, ClipboardList, Wrench, TrendingUp } from 'lucide-react'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Welcome banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{user?.accountName} &bull; {user?.paymentTerms}</p>
        </div>
        <Link to="/catalog" className="btn-primary hidden sm:flex items-center gap-2 text-sm">
          <Package size={16} /> Shop Now
        </Link>
      </div>

      {/* Hero */}
      <HeroBanner />

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Browse Products', to: '/catalog', color: 'bg-brand-50 text-brand-700' },
          { icon: ClipboardList, label: 'My Orders', to: '/orders', color: 'bg-blue-50 text-blue-700' },
          { icon: TrendingUp, label: 'Promotions', to: '/catalog?promoted=true', color: 'bg-green-50 text-green-700' },
          { icon: Wrench, label: 'Support', to: '/tickets', color: 'bg-orange-50 text-orange-700' },
        ].map(({ icon: Icon, label, to, color }) => (
          <Link key={to} to={to} className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-md transition-shadow group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
          </Link>
        ))}
      </div>

      {/* Featured products */}
      <FeaturedProductsCarousel />

      {/* Recommended */}
      <RecommendedProducts />
    </div>
  )
}
