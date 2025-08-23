import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AddressesManager } from '@/components/account/addresses-manager'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'My Addresses - ómorfo',
  description: 'Manage your saved addresses for shipping and billing.',
}

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            My Addresses
          </h1>
          <p className="text-lg text-gray-600">
            Manage your saved addresses for shipping and billing
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <AddressesManager user={session.user} />
        </Suspense>
      </div>
    </div>
  )
}
