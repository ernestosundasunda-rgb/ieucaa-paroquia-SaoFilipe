import Link from 'next/link'
import { IGREJA } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue-900">
      {/* Gradiente de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950" />

      {/* Padrão subtil */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Conteúdo */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Etiqueta */}
          <span className="inline-block text-xs font-medium tracking-wider uppercase text-blue-200 bg-blue-800/50 border border-blue-700/50 px-3 py-1.5 rounded-full">
            {IGREJA.sigla} · Uíge, Angola
          </span>

          {/* Título principal */}
          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            {IGREJA.nome}
          </h1>

          {/* Subtítulo */}
          <p className="mt-4 text-lg md:text-xl text-blue-100 leading-relaxed">
            {IGREJA.nomeCompleto}
          </p>

          {/* Slogan (placeholder) */}
          <div className="mt-8 pt-8 border-t border-blue-700/50">
            <p className="text-base md:text-lg text-blue-200 italic">
              &ldquo;{IGREJA.slogan}&rdquo;
            </p>
          </div>

          {/* Botões */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/sobre"
              className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-900 text-sm font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-950/30 hover:shadow-xl hover:shadow-blue-950/40"
            >
              Conhecer a Igreja
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-3 rounded-lg border border-blue-700/60 hover:bg-blue-800/40 transition-all duration-200"
            >
              Ver Notícias
            </Link>
          </div>
        </div>
      </div>

      {/* Curva de transição no fundo */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/0 to-transparent" />
    </section>
  )
}