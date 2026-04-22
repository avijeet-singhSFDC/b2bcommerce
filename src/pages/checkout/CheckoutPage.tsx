import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuth } from '../../auth/AuthContext'
import { createCheckout, placeOrder } from '../../api/checkout.api'
import type { Address, Checkout } from '../../types/order.types'
import { formatCurrency } from '../../utils/currency'
import { Check, MapPin, Truck, CreditCard, ClipboardCheck } from 'lucide-react'

type Step = 'address' | 'shipping' | 'payment' | 'review'

const SHIPPING_METHODS = [
  { id: 'ship001', name: 'Standard Delivery', description: '5-7 business days', estimatedDays: 7, cost: 0 },
  { id: 'ship002', name: 'Express Delivery', description: '2-3 business days', estimatedDays: 3, cost: 25 },
  { id: 'ship003', name: 'Next Day Delivery', description: 'Next business day', estimatedDays: 1, cost: 65 },
]

const STEPS: { id: Step; label: string; icon: typeof MapPin }[] = [
  { id: 'address', label: 'Address', icon: MapPin },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: ClipboardCheck },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, fetchCart } = useCartStore()
  const { user } = useAuth()
  const [step, setStep] = useState<Step>('address')
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [placing, setPlacing] = useState(false)

  const [address, setAddress] = useState<Address>({
    name: user?.accountName || '',
    street1: '123 Main St',
    city: 'Chicago',
    state: 'IL',
    postalCode: '60601',
    country: 'US',
  })
  const [shippingMethodId, setShippingMethodId] = useState('ship001')
  const [poNumber, setPoNumber] = useState('')

  useEffect(() => { if (!cart) fetchCart() }, [])
  useEffect(() => {
    if (cart) {
      createCheckout(cart.id).then(setCheckout)
    }
  }, [cart])

  const selectedShipping = SHIPPING_METHODS.find(m => m.id === shippingMethodId)!
  const subtotal = cart?.subtotal ?? 0
  const tax = cart?.tax ?? 0
  const shippingCost = selectedShipping?.cost ?? 0
  const total = subtotal + tax + shippingCost

  async function handlePlaceOrder() {
    if (!checkout) return
    setPlacing(true)
    try {
      const order = await placeOrder(checkout.id)
      navigate(`/orders/confirmation/${order.id || 'new'}`, { state: { orderNumber: (order as any).orderNumber || 'FD-2026-NEW' } })
    } finally {
      setPlacing(false)
    }
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === step)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isDone = i < currentStepIndex
          const isActive = i === currentStepIndex
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${isDone ? 'bg-brand-600 border-brand-600' : isActive ? 'border-brand-600 bg-white' : 'border-gray-300 bg-white'}`}>
                  {isDone ? <Check size={16} className="text-white" /> : <Icon size={16} className={isActive ? 'text-brand-600' : 'text-gray-400'} />}
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${isActive ? 'text-brand-600' : isDone ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < currentStepIndex ? 'bg-brand-600' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            {/* Address step */}
            {step === 'address' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Shipping Address</h2>
                {(['name', 'street1', 'city', 'state', 'postalCode'] as const).map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">{field === 'street1' ? 'Street Address' : field === 'postalCode' ? 'Postal Code' : field}</label>
                    <input
                      value={address[field]}
                      onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                ))}
                <button onClick={() => setStep('shipping')} className="btn-primary w-full">Continue to Shipping</button>
              </div>
            )}

            {/* Shipping step */}
            {step === 'shipping' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Shipping Method</h2>
                <div className="space-y-3">
                  {SHIPPING_METHODS.map(method => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethodId === method.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="shipping" value={method.id} checked={shippingMethodId === method.id} onChange={() => setShippingMethodId(method.id)} className="sr-only" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                      <div className="font-semibold text-gray-900">{method.cost === 0 ? <span className="text-green-600">Free</span> : formatCurrency(method.cost)}</div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('address')} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep('payment')} className="btn-primary flex-1">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* Payment step */}
            {step === 'payment' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 text-lg">Payment</h2>
                <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                  <strong>Account Payment Terms:</strong> {user?.paymentTerms} &mdash; Invoice will be sent after delivery.
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Order Number (optional)</label>
                  <input
                    type="text"
                    value={poNumber}
                    onChange={e => setPoNumber(e.target.value)}
                    placeholder="e.g. PO-2026-100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('shipping')} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep('review')} className="btn-primary flex-1">Review Order</button>
                </div>
              </div>
            )}

            {/* Review step */}
            {step === 'review' && (
              <div className="space-y-5">
                <h2 className="font-semibold text-gray-900 text-lg">Review Your Order</h2>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Ship to</span><span className="font-medium text-right">{address.name}, {address.city}, {address.state}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-medium">{selectedShipping.name}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-medium">{user?.paymentTerms}{poNumber ? ` · ${poNumber}` : ''}</span></div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  {cart?.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <img src={item.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-50" alt={item.productName} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                        <p className="text-gray-400">{item.quantity} case{item.quantity > 1 ? 's' : ''}</p>
                      </div>
                      <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('payment')} className="btn-secondary flex-1">Back</button>
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1">
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shippingCost === 0 ? <span className="text-green-600">Free</span> : formatCurrency(shippingCost)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
