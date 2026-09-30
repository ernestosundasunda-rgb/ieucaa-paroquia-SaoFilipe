import { CULTOS } from '@/lib/constants'
import Reveal from './Reveal'

export default function CultosSection() {
  return (
    <section id="cultos" className="py-24 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <Reveal>
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-700">
              Cultos
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Horários dos Cultos
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Junta-te a nós na adoração. Temos cultos para todas as idades e
              momentos da semana.
            </p>
          </div>
        </Reveal>

        {/* Grid de cultos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CULTOS.map((culto, i) => (
            <Reveal key={culto.nome} delay={i * 80}>
              <div className="group bg-white rounded-xl border border-gray-100 p-6 h-full transition-all duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5 hover:-translate-y-0.5">
                {/* Ícone relógio */}
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center transition-colors duration-200 group-hover:bg-blue-900 group-hover:text-white">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h3 className="mt-5 text-base font-semibold text-gray-900">
                  {culto.nome}
                </h3>

                <p className="mt-3 text-sm text-gray-500">{culto.dia}</p>

                <p className="mt-1 text-lg font-semibold text-blue-900 tracking-tight">
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