'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { IconLogout } from '@/components/icons'

interface HeaderProps {
  nome: string
}

export default function Header({ nome }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-base font-medium text-gray-500">
          Bem-vindo de volta,
        </h1>
        <p className="text-lg font-semibold text-gray-900 tracking-tight">
          {nome}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
      >
        <IconLogout className="w-4 h-4" />
        <span>Sair</span>
      </button>
    </header>
  )
}