import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, Menu, Package, ClipboardList, Wrench, LogOut, User } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useUiStore } from '../../store/uiStore'
import { useAuth } from '../../auth/AuthContext'

export function Header() {
  const { cart } = useCartStore()
  const { setCartDrawerOpen, setMobileMenuOpen } = useUiStore()
  const { user, logout } = useAuth()
  const itemCount = cart?.itemCount ?? 0

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">Flashy Drinks</span>
            <span className="text-xs text-gray-500 hidden sm:block font-medium bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">B2B Portal</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink to="/catalog" className={({ isActive }) => `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <Package size={16} />
              Products
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <ClipboardList size={16} />
              Orders
            </NavLink>
            <NavLink to="/tickets" className={({ isActive }) => `flex items-center gap-1.5 text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <Wrench size={16} />
              Support
            </NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={`Cart - ${itemCount} items`}
            >
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Account menu (desktop) */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-500" />
                </div>
                <div className="leading-tight">
                  <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-gray-500">{user?.accountName}</div>
                </div>
              </div>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
