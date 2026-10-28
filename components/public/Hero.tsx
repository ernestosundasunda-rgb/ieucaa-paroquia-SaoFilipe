import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Grid azul de fundo */}
      <div className="absolute inset-0 blue-grid opacity-60" />
      <div className="absolute inset-0 blue-radial" />

      {/* Detalhe geométrico superior direito */}
      <div className="hidden lg:block absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none">
        <div className="absolute top-12 right-12 w-full h-full border border-[#0D6EFD]/10 rounded-full" />
        <div className="absolute top-24 right-24 w-3/4 h-3/4 border border-[#0D6EFD]/10 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-px h-24 bg-[#0D6EFD]/20 rotate-45" />
      </div>

      <div className="relative container py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Coluna esquerda — conteúdo */}
          <div className="lg:col-span-7">
            <span className="section-label">
              <span className="w-8 h-px bg-[#0D6EFD]" />
              Direção da Juventude
            </span>

            <h1 className="heading-xl text-[#0F172A]">
              Uma juventude que
              <br />
              participa, serve e{' '}
              <span className="text-[#0D6EFD]">transforma.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] text-[#64748B] leading-relaxed">
              Somos a Direção da Juventude da Igreja Evangélica Unida 
              Comunhão Anglicana em Angola, Paróquia de São Filipe. Criamos
              espaços para comunhão, crescimento, liderança e participação
              ativa da juventude.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="#sobre" className="btn btn-primary">
                Conhecer a Juventude
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

              <Link href="#cultos" className="btn btn-secondary">
                Ver Programação
              </Link>
            </div>
          </div>

          {/* Coluna direita — card "Próximo Evento" */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Linha decorativa */}
              <div className="absolute -left-6 top-8 w-16 h-px bg-[#D6A84F]/40 hidden lg:block" />

              <div className="card-static p-7 max-w-md ml-auto">
                <span className="text-[11px] font-bold text-[#0D6EFD] uppercase tracking-[0.12em]">
                  Próximo Evento
                </span>

                <h3 className="mt-3 heading-md text-[#0F172A]">
                  Culto da Juventude
                </h3>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-3 text-[14px] text-[#0F172A]">
                    <div className="w-9 h-9 rounded-md bg-[#F4F8FD] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-[#0D6EFD]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Sabado · 16:00</span>
                  </div>

                  <div className="flex items-center gap-3 text-[14px] text-[#0F172A]">
                    <div className="w-9 h-9 rounded-md bg-[#F4F8FD] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-[#0D6EFD]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Paróquia de São Filipe</span>
                  </div>
                </div>

                <Link
                  href="#cultos"
                  className="btn btn-ghost mt-6 text-[13px]"
                >
                  Ver detalhes
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha inferior decorativa */}
      <div className="relative container">
        <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
      </div>
    </section>
  )
}