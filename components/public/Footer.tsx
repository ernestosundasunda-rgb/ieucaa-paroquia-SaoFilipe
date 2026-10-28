import Link from 'next/link'
import Image from 'next/image'
import { IGREJA } from '@/lib/constants'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: '#0A58CA' }} className="text-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Coluna 1 — Identidade */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logotipo IEUCAA"
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="text-[15px] font-bold leading-tight tracking-tight"
                  style={{ color: '#FFFFFF' }}
                >
                  Direção da Juventude
                </p>
                <p
                  className="text-[12px] leading-tight mt-0.5"
                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                >
                  IEUCAA · Paróquia de São Filipe
                </p>
              </div>
            </div>

            <p
              className="text-[14px] leading-relaxed mt-5 max-w-md"
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
            >
              Uma juventude que participa, serve e transforma. Criamos espaços
              para comunhão, crescimento, liderança e participação ativa.
            </p>

            <p
              className="text-[12px] font-semibold tracking-[0.08em] uppercase mt-5"
              style={{ color: '#D6A84F' }}
            >
              Jovens hoje · Líderes amanhã
            </p>
          </div>

          {/* Coluna 2 — Contactos */}
          <div>
            <h3
              className="text-[11px] font-bold uppercase tracking-[0.12em] mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Contactos
            </h3>

            <ul className="space-y-3 text-[13px]">
              <li className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  style={{ color: '#D6A84F' }}
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
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  {IGREJA.localizacao.bairro}, {IGREJA.localizacao.provincia}
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  style={{ color: '#D6A84F' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${IGREJA.contactos.email}`}
                  className="transition-opacity hover:opacity-80"
                  style={{ color: 'rgba(255, 255, 255, 0.85)' }}
                >
                  {IGREJA.contactos.email}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  style={{ color: '#D6A84F' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                  {IGREJA.contactos.telefone}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Linha divisória + Copyright */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <p
            className="text-[12px]"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            © {ano} IEUCAA · Todos os direitos reservados
          </p>

          <p
            className="text-[12px]"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Paróquia de São Filipe — Papelão, Uíge
          </p>
        </div>
      </div>
    </footer>
  )
}