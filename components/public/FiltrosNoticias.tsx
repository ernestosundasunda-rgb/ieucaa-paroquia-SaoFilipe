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
            className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-200 ${
              ativo
                ? 'bg-[#082F6B] text-white'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#0D6EFD]/40 hover:text-[#0D6EFD]'
            }`}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}