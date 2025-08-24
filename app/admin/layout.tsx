import { AdminGuard } from '@/components/admin/admin-guard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - ómorfo',
  description: 'Manage your ómorfo store with the admin dashboard',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  )
}
