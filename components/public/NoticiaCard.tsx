import Link from 'next/link'
import { CATEGORIAS_NOTICIA } from '@/lib/constants'
import type { Noticia } from '@/types'

interface Props {
  noticia: Noticia
}

export default function NoticiaCard({ noticia }: Props) {
  const dataObj = new Date(noticia.data_publicacao)
  const dia = dataObj.toLocaleDateString('pt-PT', { day: '2-digit' })
  const mes = dataObj
    .toLocaleDateString('pt-PT', { month: 'short' })
    .replace('.', '')
    .toUpperCase()
  const ano = dataObj.getFullYear()

  const categoriaNome =
    CATEGORIAS_NOTICIA[noticia.categoria] ?? noticia.categoria

  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="group block bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-primary)]/40 hover:shadow-[0_12px_40px_rgba(13,110,253,0.12)]"
    >
      {/* Imagem ou gradiente */}
      <div className="h-40 relative overflow-hidden bg-[var(--color-primary-dark)]">
        {noticia.imagem_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={noticia.imagem_url}
              alt={noticia.titulo}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/70 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />
          </>
        )}

        {/* Card azul da data — sobreposto */}
        <div
          className="absolute top-4 left-4 rounded-[10px] px-3 py-2 text-white text-center shadow-[0_4px_16px_rgba(13,110,253,0.35)]"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <p className="text-[18px] font-bold leading-none tracking-tight tabular-nums">
            {dia}
          </p>
          <p className="text-[10px] font-bold tracking-[0.08em] mt-0.5">
            {mes}
          </p>
        </div>

        {/* Badge categoria */}
        <div className="absolute top-4 right-4">
          <span className="inline-block text-[10px] font-bold tracking-[0.08em] uppercase bg-white/15 backdrop-blur-sm text-white border border-white/20 px-2.5 py-1 rounded-full">
            {categoriaNome}
          </span>
        </div>
      </div>

      {/* Corpo */}
      <div className="p-5">
        <h3 className="text-[15px] font-bold text-[#0F172A] group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-2 leading-snug">
          {noticia.titulo}
        </h3>

        <p className="mt-2 text-[13px] text-[#64748B] leading-relaxed line-clamp-3">
          {noticia.conteudo}
        </p>

        <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B]">
            {noticia.autor_nome || 'Paróquia'}
          </span>
          <span className="text-[11px] text-[#64748B]">{ano}</span>
        </div>
      </div>
    </Link>
  )
}