import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">F</span>
              </div>
              <span className="font-bold text-white">Flashy Drinks</span>
            </div>
            <p className="text-sm">Your trusted beverage partner for retail excellence.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Products</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog?categoryId=cat-soda" className="hover:text-white transition-colors">Sodas</Link></li>
              <li><Link to="/catalog?categoryId=cat-energy" className="hover:text-white transition-colors">Energy Drinks</Link></li>
              <li><Link to="/catalog?categoryId=cat-water" className="hover:text-white transition-colors">Water</Link></li>
              <li><Link to="/catalog?categoryId=cat-mixer" className="hover:text-white transition-colors">Mixers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/tickets" className="hover:text-white transition-colors">Support Tickets</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/tickets?type=equipment" className="hover:text-white transition-colors">Equipment Service</Link></li>
              <li><Link to="/tickets?type=customer_service" className="hover:text-white transition-colors">Customer Service</Link></li>
              <li><a href="mailto:support@flashydrinks.com" className="hover:text-white transition-colors">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          &copy; {new Date().getFullYear()} Flashy Drinks Inc. All rights reserved. Powered by Salesforce B2B Commerce.
        </div>
      </div>
    </footer>
  )
}
