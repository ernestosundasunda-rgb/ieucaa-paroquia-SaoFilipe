import { IGREJA } from '@/lib/constants'
import Reveal from './Reveal'

export default function SobreSection() {
  const pilares = [
    {
      titulo: 'Missão',
      texto:
        'Proclamar o Evangelho de Jesus Cristo e promover a comunhão entre os fiéis, servindo a comunidade com amor e dedicação.',
      Icone: IconMissao,
    },
    {
      titulo: 'Visão',
      texto:
        'Ser uma paróquia de referência na Província do Uíge, onde cada pessoa encontra acolhimento, esperança e crescimento espiritual.',
      Icone: IconVisao,
    },
    {
      titulo: 'Valores',
      texto:
        'Fé, comunhão, serviço, integridade e amor ao próximo — os princípios que guiam a nossa caminhada cristã.',
      Icone: IconValores,
    },
  ]

  return (
    <section id="sobre" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto */}
          <Reveal>
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-700">
              Sobre nós
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Uma paróquia ao serviço da comunidade
            </h2>

            <div className="mt-6 space-y-4 text-base text-gray-600 leading-relaxed">
              <p>
                A <strong className="text-gray-900">{IGREJA.nome}</strong> faz
                parte da {IGREJA.nomeCompleto}, uma comunidade de fé enraizada
                na tradição anglicana e comprometida com o serviço a Deus e ao
                próximo.
              </p>
              <p>
                Situada na {IGREJA.localizacao.provincia}, no{' '}
                {IGREJA.localizacao.bairro}, a nossa paróquia acolhe fiéis de
                todas as idades, promovendo o crescimento espiritual, a
                comunhão fraterna e o serviço à comunidade.
              </p>
              <p>
                Ao longo dos anos, temos procurado ser um lugar onde cada
                pessoa encontra acolhimento, esperança e um caminho de fé.
              </p>
            </div>
          </Reveal>

          {/* Pilares */}
          <div className="space-y-5">
            {pilares.map((pilar, i) => (
              <Reveal key={pilar.titulo} delay={i * 120}>
                <div className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-200 rounded-xl p-6 transition-all duration-200 hover:shadow-md hover:shadow-blue-900/5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-900 text-white flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover:bg-blue-700">
                      <pilar.Icone className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-gray-900">
                        {pilar.titulo}
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                        {pilar.texto}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function IconMissao({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function IconVisao({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
}

function IconValores({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  )
}