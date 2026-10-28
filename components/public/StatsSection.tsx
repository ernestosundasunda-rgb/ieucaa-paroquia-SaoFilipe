interface StatProps {
  numero: string
  label: string
  sublabel: string
}

function Stat({ numero, label, sublabel }: StatProps) {
  return (
    <div className="text-center lg:text-left">
      <p className="heading-lg text-[#082F6B] tabular-nums">{numero}</p>
      <p className="mt-2 text-[14px] font-semibold text-[#0F172A]">{label}</p>
      <p className="mt-1 text-[12px] text-[#64748B]">{sublabel}</p>
    </div>
  )
}

export default function StatsSection({
  totalMembros,
  totalNoticias,
}: {
  totalMembros: number
  totalNoticias: number
}) {
  return (
    <section className="bg-white border-y border-[#E2E8F0]">
      <div className="container py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <Stat
            numero={`${totalMembros}+`}
            label="Membros ativos"
            sublabel="Crescendo juntos"
          />
          <Stat
            numero={`${totalNoticias}`}
            label="Notícias publicadas"
            sublabel="Informação e novidades"
          />
          <Stat
            numero="5"
            label="Cultos por semana"
            sublabel="Comunhão e adoração"
          />
          <Stat
            numero="100%"
            label="Compromisso"
            sublabel="Com a nossa missão"
          />
        </div>
      </div>
    </section>
  )
}