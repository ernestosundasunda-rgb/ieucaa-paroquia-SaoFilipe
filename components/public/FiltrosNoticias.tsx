'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIAS_NOTICIA } from '@/lib/constants'

export default function FiltrosNoticias() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriaAtiva = searchParams.get('categoria') ?? 'todas'

  const categorias = [
    { valor: 'todas', label: 'Todas' },
    ...Object.entries(CATEGORIAS_NOTICIA).map(([valor, label]) => ({
      valor,
      label,
    })),
  ]

  function handleClick(valor: string) {
    if (valor === 'todas') {
      router.push('/noticias')
    } else {
      router.push(`/noticias?categoria=${valor}`)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {categorias.map((cat) => {
        const ativo = categoriaAtiva === cat.valor
        return (
          <button
            key={cat.valor}
            onClick={() => handleClick(cat.valor)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              ativo
                ? 'bg-blue-900 text-white shadow-sm shadow-blue-900/20'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:text-blue-900'
            }`}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}