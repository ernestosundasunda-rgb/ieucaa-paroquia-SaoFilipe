'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  id: string
  nome: string
}

export default function DeleteMembroButton({ id, nome }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('membros').delete().eq('id', id)

    if (error) {
      alert('Erro ao eliminar: ' + error.message)
      setLoading(false)
      setConfirmar(false)
      return
    }

    setLoading(false)
    setConfirmar(false)
    router.refresh()
  }

  if (confirmar) {
    return (
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