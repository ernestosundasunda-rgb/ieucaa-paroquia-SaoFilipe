'use client'

interface StatCardProps {
  titulo: string
  valor: string | number
  sublabel?: string
  Icone: (props: { className?: string }) => React.ReactElement
  gradiente: string
}

export function StatCard({
  titulo,
  valor,
  sublabel,
  Icone,
  gradiente,
}: StatCardProps) {
  return (
    <div
      className="group relative rounded-[16px] p-6 text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
      style={{ background: gradiente }}
    >
      {/* Círculo decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border border-white/5 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {titulo}
          </p>
          <p className="mt-2 text-[28px] font-bold tracking-tight tabular-nums leading-none">
            {valor}
          </p>
          {sublabel && (
            <p
              className="mt-2 text-[11px]"
              style={{ color: 'rgba(255, 255, 255, 0.75)' }}
            >
              {sublabel}
            </p>
          )}
        </div>

        <div className="w-11 h-11 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-white/25">
          <Icone className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}