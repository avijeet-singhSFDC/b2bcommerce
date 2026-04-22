import { NavLink } from 'react-router-dom'
import { X, Package, ClipboardList, Wrench, Home, User, LogOut } from 'lucide-react'
import { useUiStore } from '../../store/uiStore'
import { useAuth } from '../../auth/AuthContext'

export function MobileNav() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUiStore()
  const { user, logout } = useAuth()

  if (!mobileMenuOpen) return null

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'
    }`

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
      <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Flashy Drinks</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-brand-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-gray-500">{user?.accountName}</div>
              <div className="text-xs text-brand-600 font-medium">{user?.paymentTerms}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            <Home size={20} /> Home
          </NavLink>
          <NavLink to="/catalog" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            <Package size={20} /> Products
          </NavLink>
          <NavLink to="/orders" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            <ClipboardList size={20} /> My Orders
          </NavLink>
          <NavLink to="/tickets" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            <Wrench size={20} /> Support Tickets
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => { logout(); setMobileMenuOpen(false) }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
