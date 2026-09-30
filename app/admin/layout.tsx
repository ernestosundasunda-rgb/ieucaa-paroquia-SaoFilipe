import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import { getUserWithProfile } from '@/lib/auth/getUser'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getUserWithProfile()

  if (!user || !profile) {
    redirect('/auth/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={profile.role} nome={profile.nome} />

      <div className="flex-1 flex flex-col">
        <Header nome={profile.nome} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}