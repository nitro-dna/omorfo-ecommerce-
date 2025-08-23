'use client'

import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'

export default function CartDebugPage() {
  const { state, addItem, removeItem, clearCart } = useCart()
  const { items, total, itemCount } = state

  const handleAddTestItem = () => {
    const testItem = {
      id: `test-${Date.now()}`,
      productId: 'test-product',
      name: 'Test Product',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      quantity: 1,
      size: 'A3',
      frame: 'Black',
    }

    console.log('Adding test item:', testItem)
    addItem(testItem)
  }

  const handleRemoveItem = (id: string) => {
    console.log('Removing item:', id)
    removeItem(id)
  }

  const handleClearCart = () => {
    console.log('Clearing cart')
    clearCart()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart State</h2>
          <div className="space-y-2">
            <p><strong>Items in cart:</strong> {itemCount}</p>
            <p><strong>Total:</strong> ${total.toFixed(2)}</p>
            <p><strong>Items array length:</strong> {items.length}</p>
          </div>
          
          <div className="mt-4 space-x-4">
            <Button onClick={handleAddTestItem}>
              Add Test Item
            </Button>
            <Button onClick={handleClearCart} variant="outline">
              Clear Cart
            </Button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cart Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Size: {item.size} | Frame: {item.frame}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity} | Price: ${item.price}</p>
                  </div>
                  <Button 
                    onClick={() => handleRemoveItem(item.id)}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Info</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify({ items, total, itemCount }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
