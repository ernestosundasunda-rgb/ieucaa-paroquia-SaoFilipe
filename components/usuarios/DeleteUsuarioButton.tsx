'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  nome: string
  meuUserId: string
  roleAlvoEhSuperadmin: boolean
}

export default function DeleteUsuarioButton({
  userId,
  nome,
  meuUserId,
  roleAlvoEhSuperadmin,
}: Props) {
  const router = useRouter()
  const [confirmar, setConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // ⚠️ Nunca eliminar a si próprio
  if (userId === meuUserId) {
    return null
  }

  // ⚠️ Nunca eliminar outro superadmin
  if (roleAlvoEhSuperadmin) {
    return null
  }

  async function handleDelete() {
    setErro('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (error) {
      setErro('Erro: ' + error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setConfirmar(false)
    router.refresh()
  }

  if (confirmar) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-150 disabled:opacity-60"
          >
            {loading ? '...' : 'Confirmar'}
          </button>
          <button
            onClick={() => setConfirmar(false)}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
          >
            Cancelar
          </button>
        </div>
        {erro && <p className="text-xs text-red-600">{erro}</p>}
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirmar(true)}
      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
    >
      Eliminar
    </button>
  )
}