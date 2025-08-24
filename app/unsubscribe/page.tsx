import { Suspense } from 'react'
import { UnsubscribeClient } from '@/components/unsubscribe/unsubscribe-client'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const dynamic = 'force-dynamic'

interface UnsubscribePageProps {
  searchParams: {
    email?: string
  }
}

export default function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UnsubscribeClient email={searchParams.email} />
    </Suspense>
  )
}
