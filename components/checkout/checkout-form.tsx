'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { StripePayment } from './stripe-payment'
import { MapPin, Plus, Home, Building } from 'lucide-react'
import toast from 'react-hot-toast'

type CheckoutStep = 'shipping' | 'payment' | 'review'

interface Address {
  id: string
  type: 'shipping' | 'billing'
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
  is_default: boolean
}

interface ShippingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentForm {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export function CheckoutForm() {
  const { data: session } = useSession()
  const { state, clearCart } = useCart()
  const { items = [], total = 0 } = state || {}
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>('')
  const [paymentIntentId, setPaymentIntentId] = useState<string>('')
  
  // Address management
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Germany',
  })

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  })

  // Load saved addresses when component mounts
  useEffect(() => {
    if (session) {
      fetchSavedAddresses()
    }
  }, [session])

  // Load saved addresses when an address is selected
  useEffect(() => {
    if (selectedAddressId && savedAddresses.length > 0) {
      const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId)
      if (selectedAddress) {
        setShippingForm({
          firstName: selectedAddress.first_name,
          lastName: selectedAddress.last_name,
          email: session?.user?.email || '',
          phone: selectedAddress.phone || '',
          address: selectedAddress.address_line_1,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.postal_code,
          country: selectedAddress.country,
        })
      }
    }
  }, [selectedAddressId, savedAddresses, session])

  const fetchSavedAddresses = async () => {
    try {
      setIsLoadingAddresses(true)
      const response = await fetch('/api/supabase/addresses')
      
      if (response.ok) {
        const data = await response.json()
        const addresses = data.data || []
        setSavedAddresses(addresses)
        
        // Auto-select default shipping address if available
        const defaultShipping = addresses.find((addr: any) => addr.type === 'shipping' && addr.is_default)
        if (defaultShipping) {
          setSelectedAddressId(defaultShipping.id)
        } else if (addresses.length > 0) {
          // Select first shipping address if no default
          const firstShipping = addresses.find((addr: any) => addr.type === 'shipping')
          if (firstShipping) {
            setSelectedAddressId(firstShipping.id)
          }
        }
      } else {
        console.error('Failed to fetch addresses')
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    setUseNewAddress(false)
  }

  const handleUseNewAddress = () => {
    setUseNewAddress(true)
    setSelectedAddressId('')
    setShippingForm({
      firstName: '',
      lastName: '',
      email: session?.user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Germany',
    })
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsProcessing(true)
      
      // Create payment intent
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total, // No tax
          currency: 'usd',
          metadata: {
            items: JSON.stringify(items.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            }))),
            shipping: JSON.stringify(shippingForm),
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      setClientSecret(data.clientSecret)
      setPaymentIntentId(data.paymentIntentId)
      setCurrentStep('review')
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast.error('Failed to initialize payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Here you would typically:
      // 1. Save order to database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Create shipping label
      
      console.log('Payment successful:', paymentIntentId)
      
      // For now, just clear cart and show success
      clearCart()
      toast.success('Order placed successfully!')
      
      // Redirect to success page or account
      window.location.href = '/account'
    } catch (error) {
      console.error('Error processing successful payment:', error)
      toast.error('Payment successful but order processing failed. Please contact support.')
    }
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error)
    toast.error('Payment failed. Please try again.')
  }

  const steps = [
    { id: 'shipping', name: 'Shipping Information', status: currentStep === 'shipping' ? 'current' : currentStep === 'payment' || currentStep === 'review' ? 'completed' : 'upcoming' },
    { id: 'payment', name: 'Payment Method', status: currentStep === 'payment' ? 'current' : currentStep === 'review' ? 'completed' : 'upcoming' },
    { id: 'review', name: 'Order Review', status: currentStep === 'review' ? 'current' : 'upcoming' },
  ]

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  const shippingAddresses = savedAddresses.filter(addr => addr.type === 'shipping')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Checkout Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <nav aria-label="Progress">
              <ol className="flex items-center space-x-4">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className="flex items-center">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-accent-500 text-white' :
                        step.status === 'current' ? 'bg-accent-100 text-accent-700 border-2 border-accent-500' :
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {step.status === 'completed' ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{stepIdx + 1}</span>
                        )}
                      </div>
                      <span className={`ml-3 text-sm font-medium ${
                        step.status === 'completed' ? 'text-accent-600' :
                        step.status === 'current' ? 'text-accent-700' :
                        'text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <svg className="ml-4 w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {currentStep === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                
                {/* Saved Addresses Section */}
                {session && shippingAddresses.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium text-gray-900">Saved Shipping Addresses</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUseNewAddress}
                        className="flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Use New Address</span>
                      </Button>
                    </div>
                    
                    {isLoadingAddresses ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Loading addresses...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shippingAddresses.map((address) => (
                          <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedAddressId === address.id && !useNewAddress
                                ? 'border-accent-500 bg-accent-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleAddressSelect(address.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Home className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-900">
                                    {address.first_name} {address.last_name}
                                  </span>
                                  {address.is_default && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-accent-100 text-accent-800">
                                      Default
                                    </span>
                                  )}
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  {address.company && (
                                    <p>{address.company}</p>
                                  )}
                                  <p>{address.address_line_1}</p>
                                  {address.address_line_2 && (
                                    <p>{address.address_line_2}</p>
                                  )}
                                  <p>
                                    {address.city}, {address.state} {address.postal_code}
                                  </p>
                                  <p>{address.country}</p>
                                  {address.phone && (
                                    <p>{address.phone}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="ml-2">
                                <input
                                  type="radio"
                                  name="address"
                                  value={address.id}
                                  checked={selectedAddressId === address.id && !useNewAddress}
                                  onChange={() => handleAddressSelect(address.id)}
                                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* New Address Form */}
                {(!session || useNewAddress || shippingAddresses.length === 0) && (
                  <div className="space-y-6">
                    {session && shippingAddresses.length > 0 && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-gray-900">New Shipping Address</h3>
                        {shippingAddresses.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setUseNewAddress(false)
                              if (shippingAddresses.length > 0) {
                                setSelectedAddressId(shippingAddresses[0].id)
                              }
                            }}
                          >
                            Use Saved Address
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.firstName}
                          onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.lastName}
                          onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          required
                          value={shippingForm.phone}
                          onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        required
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.state}
                          onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.zipCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        value={shippingForm.country}
                        onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-accent-500 focus:border-accent-500"
                      >
                        <option value="Germany">Germany</option>
                        <option value="Austria">Austria</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                        <option value="Italy">Italy</option>
                        <option value="Spain">Spain</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Belgium">Belgium</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit">Continue to Payment</Button>
                </div>
              </form>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Your payment information is secure and encrypted. We use Stripe to process all payments.
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-8 h-6 bg-gray-200 rounded border"></div>
                      <div className="w-8 h-6 bg-gray-200 rounded border"></div>
                      <div className="w-8 h-6 bg-gray-200 rounded border"></div>
                      <div className="w-8 h-6 bg-gray-200 rounded border"></div>
                    </div>
                    <span className="text-xs text-gray-500">Secure payment powered by Stripe</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep('shipping')}>
                    Back to Shipping
                  </Button>
                  <Button 
                    onClick={handlePaymentSubmit}
                    loading={isProcessing}
                    disabled={isProcessing}
                  >
                    Continue to Review
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Review</h2>
                
                {/* Shipping Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {shippingForm.firstName} {shippingForm.lastName}<br />
                    {shippingForm.address}<br />
                    {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}<br />
                    {shippingForm.country}
                  </p>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                  <p className="text-sm text-gray-600">
                    Secure payment via Stripe<br />
                    Payment Intent: {paymentIntentId}
                  </p>
                </div>

                {/* Stripe Payment Form */}
                {clientSecret && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium text-gray-900 mb-4">Complete Payment</h3>
                    <StripePayment
                      clientSecret={clientSecret}
                      amount={total}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                    Back to Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          {/* Cart Items */}
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
