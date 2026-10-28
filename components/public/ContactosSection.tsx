import { IGREJA } from '@/lib/constants'
import Reveal from './Reveal'

export default function ContactosSection() {
  return (
    <section id="contactos" className="section bg-[#F8FAFC] scroll-mt-20">
      <div className="container">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-4">
              <span className="section-label">
                <span className="w-8 h-px bg-[#0D6EFD]" />
                Contactos
              </span>
            </div>

            <div className="lg:col-span-8">
              <h2 className="section-title">Fala connosco</h2>
              <p className="section-subtitle">
                Estamos disponíveis para te receber. Visita-nos ou entra em
                contacto pelos nossos canais.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Localização */}
          <Reveal>
            <div className="group relative bg-[var(--color-primary)] text-white rounded-[14px] p-6 h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-px bg-white/30" />

              <div className="relative w-10 h-10 rounded-md bg-white/15 border border-white/20 flex items-center justify-center transition-colors duration-200 group-hover:bg-white group-hover:text-[var(--color-primary)] group-hover:border-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <h3 className="relative mt-4 text-[16px] font-bold tracking-tight text-white">
                Onde estamos
              </h3>

              <address className="relative mt-3 not-italic text-[13px] text-white/85 leading-relaxed space-y-0.5">
                <p>{IGREJA.localizacao.provincia}</p>
                <p>{IGREJA.localizacao.bairro}</p>
                <p className="text-white/60">{IGREJA.localizacao.referencia}</p>
                <p>{IGREJA.localizacao.pais}</p>
              </address>
            </div>
          </Reveal>

          {/* Contactos */}
          <Reveal delay={120}>
            <div className="group relative bg-[var(--color-primary)] text-white rounded-[14px] p-6 h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute top-4 right-4 w-8 h-px bg-white/30" />

              <div className="relative w-10 h-10 rounded-md bg-white/15 border border-white/20 flex items-center justify-center transition-colors duration-200 group-hover:bg-white group-hover:text-[var(--color-primary)] group-hover:border-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="relative mt-4 text-[16px] font-bold tracking-tight text-white">
                Contactos
              </h3>

              <ul className="relative mt-3 space-y-3">
                <li>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
                    Telefone
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium text-white">
                    {IGREJA.contactos.telefone}
                  </p>
                </li>

                <li>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
                    Email
                  </p>
                  <p className="mt-0.5 text-[13px] font-medium text-white">
                    {IGREJA.contactos.email}
                  </p>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}