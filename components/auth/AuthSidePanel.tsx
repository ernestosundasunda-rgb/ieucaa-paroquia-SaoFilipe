import Image from 'next/image'

interface Props {
  titulo: string
  subtitulo: string
}

export default function AuthSidePanel({ subtitulo }: Props) {
  return (
    <div
      className="hidden lg:flex relative overflow-hidden rounded-l-[20px]"
      style={{ backgroundColor: 'var(--color-primary-dark-2)' }}
    >
      {/* Círculos decorativos */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full border border-white/8 -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full border border-white/8 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-40 h-px bg-[#D6A84F]/40" />
      <div className="absolute bottom-1/3 right-0 w-24 h-px bg-[#D6A84F]/30" />

      {/* Detalhe azul brilhante — diagonal */}
      <div
        className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none opacity-30"
        style={{
          background:
            'linear-gradient(135deg, transparent 45%, var(--color-primary) 45%, var(--color-primary) 55%, transparent 55%)',
        }}
      />

      <div className="relative flex flex-col justify-between p-10 w-full">
        {/* Logo + Nome */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logotipo IEUCAA"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p
                className="text-[13px] font-bold leading-tight"
                style={{ color: '#FFFFFF' }}
              >
                Direção da Juventude
              </p>
              <p
                className="text-[11px] leading-tight"
                style={{ color: 'rgba(255, 255, 255, 0.65)' }}
              >
                IEUCAA · Paróquia de São Filipe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 h-px bg-white/30" />
            <div className="text-right">
              <p
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: '#FFFFFF' }}
              >
                Jovens hoje
              </p>
              <p
                className="text-[10px]"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Líderes amanhã
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="my-8">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: '#6BB0FF' }}
          >
            Bem-vindo
          </span>

          <h2 className="mt-3 text-[28px] xl:text-[32px] font-bold leading-[1.15] tracking-tight">
            <span style={{ color: '#FFFFFF' }}>Juntos por uma</span>
            <br />
            <span style={{ color: '#6BB0FF' }}>juventude</span>
            <br />
            <span style={{ color: '#FFFFFF' }}>com </span>
            <span style={{ color: '#6BB0FF' }}>propósito.</span>
          </h2>

          <p
            className="mt-4 text-[13px] leading-relaxed max-w-xs"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {subtitulo}
          </p>

          {/* Indicadores */}
          <div className="mt-8 space-y-3.5">
            <Indicador
              titulo="Comunhão"
              texto="Juntos somos mais fortes"
              Icone={IconComunhao}
            />
            <Indicador
              titulo="Crescimento"
              texto="Aprender para servir"
              Icone={IconCrescimento}
            />
            <Indicador
              titulo="Serviço"
              texto="Impactar vidas"
              Icone={IconServico}
            />
            <Indicador
              titulo="Liderança"
              texto="Hoje, para o amanhã"
              Icone={IconLideranca}
            />
          </div>
        </div>

        {/* Rodapé — citação */}
        <div>
          <p
            className="text-[16px] italic"
            style={{
              color: '#FFFFFF',
              fontFamily: 'Georgia, serif',
            }}
          >
            Mais que uma igreja,
            <br />
            uma família.
          </p>
          <div className="mt-3 w-10 h-0.5 bg-[#D6A84F]" />
        </div>
      </div>
    </div>
  )
}

function Indicador({
  titulo,
  texto,
  Icone,
}: {
  titulo: string
  texto: string
  Icone: (props: { className?: string }) => React.ReactElement
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: 'rgba(107, 176, 255, 0.15)' }}
      >
        <Icone className="w-4 h-4" />
      </div>
      <div>
        <p
          className="text-[12px] font-semibold leading-tight"
          style={{ color: '#FFFFFF' }}
        >
          {titulo}
        </p>
        <p
          className="text-[10px] leading-tight mt-0.5"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {texto}
        </p>
      </div>
    </div>
  )
}

function IconComunhao({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="#6BB0FF"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a3 3 0 11-3-3 3 3 0 013 3z"
      />
    </svg>
  )
}

function IconCrescimento({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="#6BB0FF"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  )
}

function IconServico({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="#6BB0FF"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}

function IconLideranca({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="#6BB0FF"
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