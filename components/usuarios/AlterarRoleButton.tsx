'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types'

interface Props {
  userId: string
  roleAtual: UserRole
  meuUserId: string
  roleAlvoEhSuperadmin: boolean
}

export default function AlterarRoleButton({
  userId,
  roleAtual,
  meuUserId,
  roleAlvoEhSuperadmin,
}: Props) {
  const router = useRouter()
  const [aberto, setAberto] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // ⚠️ NUNCA permitir alterar o próprio role
  if (userId === meuUserId) {
    return (
      <span className="text-xs text-gray-400 italic">
        Não podes alterar o teu próprio nível
      </span>
    )
  }

  // ⚠️ NUNCA permitir alterar role de outro superadmin
  if (roleAlvoEhSuperadmin) {
    return (
      <span className="text-xs text-gray-400 italic">
        Superadmin protegido
      </span>
    )
  }

  async function handleAlterar(novoRole: UserRole) {
    if (novoRole === roleAtual) {
      setAberto(false)
      return
    }

    setErro('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ role: novoRole })
      .eq('id', userId)

    if (error) {
      setErro('Erro: ' + error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setAberto(false)
    router.refresh()
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150"
      >
        Alterar nível
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-1">
        {(['member', 'admin', 'superadmin'] as UserRole[]).map((role) => (
          <button
            key={role}
            onClick={() => handleAlterar(role)}
            disabled={loading}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 capitalize disabled:opacity-60 ${
              role === roleAtual
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {role}
          </button>
        ))}
        <button
          onClick={() => setAberto(false)}
          disabled={loading}
          className="px-2 py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          ✕
        </button>
      </div>

      {erro && <p className="text-xs text-red-600">{erro}</p>}
    </div>
  )
}