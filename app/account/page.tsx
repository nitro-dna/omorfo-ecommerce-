import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AccountDashboard } from '@/components/account/account-dashboard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'My Account - ómorfo',
  description: 'Manage your account, view orders, and update your profile.',
}

export default async function AccountPage() {
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
            My Account
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, {session.user?.name || session.user?.email}
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <AccountDashboard user={session.user} />
        </Suspense>
      </div>
    </div>
  )
}

