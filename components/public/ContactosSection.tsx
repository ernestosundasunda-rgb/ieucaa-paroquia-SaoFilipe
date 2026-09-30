import { IGREJA } from '@/lib/constants'
import Reveal from './Reveal'

export default function ContactosSection() {
  return (
    <section id="contactos" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <Reveal>
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-700">
              Contactos
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Fala connosco
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Estamos disponíveis para te receber. Visita-nos ou entra em
              contacto pelos nossos canais.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Localização */}
          <Reveal>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-8 h-full">
              <div className="w-12 h-12 rounded-lg bg-blue-900 text-white flex items-center justify-center mb-5">
                <svg
                  className="w-5 h-5"
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

              <h3 className="text-lg font-semibold text-gray-900">
                Onde Estamos
              </h3>

              <address className="mt-4 not-italic text-sm text-gray-600 leading-relaxed space-y-1">
                <p>{IGREJA.localizacao.provincia}</p>
                <p>{IGREJA.localizacao.bairro}</p>
                <p className="text-gray-500">
                  {IGREJA.localizacao.referencia}
                </p>
                <p>{IGREJA.localizacao.pais}</p>
              </address>
            </div>
          </Reveal>

          {/* Contactos */}
          <Reveal delay={120}>
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-8 h-full">
              <div className="w-12 h-12 rounded-lg bg-blue-900 text-white flex items-center justify-center mb-5">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Contactos
              </h3>

              <ul className="mt-4 space-y-4">
                <li>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Telefone
                  </p>
                  <p className="mt-1 text-sm text-gray-800 font-medium">
                    {IGREJA.contactos.telefone}
                  </p>
                </li>

                <li>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-gray-800 font-medium">
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