import Reveal from './Reveal'

const PILARES = [
  {
    numero: '01',
    titulo: 'Formação',
    descricao:
      'Capacitação e desenvolvimento integral da juventude, com base em valores cristãos.',
  },
  {
    numero: '02',
    titulo: 'Comunidade',
    descricao:
      'União, comunhão e amizade verdadeira entre os jovens da paróquia.',
  },
  {
    numero: '03',
    titulo: 'Serviço',
    descricao:
      'Impacto social e voluntariado — servir a Deus servindo o próximo.',
  },
  {
    numero: '04',
    titulo: 'Adoração',
    descricao:
      'Louvor, vida espiritual e intimidade com Deus através da música e oração.',
  },
]

export default function OQueFazemos() {
  return (
    <section className="section bg-[#F8FAFC]">
      <div className="container">
        {/* Cabeçalho */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-4">
            <Reveal>
              <span className="section-label">
                <span className="w-8 h-px bg-[#0D6EFD]" />
                O que fazemos
              </span>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={100}>
              <h2 className="section-title">
                A Direção da Juventude atua em várias áreas para promover o
                desenvolvimento integral.
              </h2>
            </Reveal>
          </div>
        </div>

        {/* Grid de pilares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PILARES.map((pilar, i) => (
            <Reveal key={pilar.numero} delay={i * 80}>
              <div className="card p-6 h-full flex flex-col">
                <span className="text-[12px] font-bold text-[#D6A84F] tracking-[0.15em]">
                  {pilar.numero}
                </span>

                <h3 className="mt-4 heading-sm text-[#0F172A]">
                  {pilar.titulo}
                </h3>

                <p className="mt-3 text-[14px] text-[#64748B] leading-relaxed flex-1">
                  {pilar.descricao}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}