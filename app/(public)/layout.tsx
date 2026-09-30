import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar logado={!!user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}