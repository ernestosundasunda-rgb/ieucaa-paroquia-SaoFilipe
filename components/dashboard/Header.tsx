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
    <header className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-[13px] font-medium text-[#64748B]">
          Bem-vindo de volta,
        </h1>
        <p className="text-[18px] font-bold text-[#0F172A] tracking-tight">
          {nome}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-2 min-h-[40px] px-5 rounded-[10px] text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
        style={{
          backgroundColor: 'var(--color-danger)',
          color: '#FFFFFF',
        }}
      >
        <IconLogout className="w-4 h-4" />
        <span>Sair</span>
      </button>
    </header>
  )
}