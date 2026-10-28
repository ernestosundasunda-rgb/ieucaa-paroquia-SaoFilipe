import { CULTOS } from '@/lib/constants'
import Reveal from './Reveal'

export default function CultosSection() {
  return (
    <section id="cultos" className="section bg-white scroll-mt-20">
      <div className="container">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-4">
              <span className="section-label">
                <span className="w-8 h-px bg-[#0D6EFD]" />
                Cultos
              </span>
            </div>

            <div className="lg:col-span-8">
              <h2 className="section-title">Horários dos cultos</h2>
              <p className="section-subtitle">
                Junta-te a nós na adoração. Temos cultos para todas as idades
                e momentos da semana.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CULTOS.map((culto, i) => (
            <Reveal key={culto.nome} delay={i * 80}>
              <div className="group relative bg-[var(--color-primary)] text-white rounded-[14px] p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative w-10 h-10 rounded-md bg-white/15 border border-white/20 flex items-center justify-center transition-colors duration-200 group-hover:bg-white group-hover:text-[var(--color-primary)] group-hover:border-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="relative mt-4 text-[15px] font-bold tracking-tight text-white">
                  {culto.nome}
                </h3>

                <p className="relative mt-1.5 text-[11px] text-white/70 uppercase tracking-[0.08em] font-semibold">
                  {culto.dia}
                </p>

                <p className="relative mt-2 text-[17px] font-bold text-white tracking-tight tabular-nums">
                  {culto.inicio} — {culto.fim}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}