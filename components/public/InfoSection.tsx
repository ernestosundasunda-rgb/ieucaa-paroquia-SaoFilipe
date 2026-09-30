import { IGREJA, CULTOS } from '@/lib/constants'

export default function InfoSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho */}
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-700">
            Informações
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Visita-nos
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-relaxed">
            Estamos de portas abertas para te receber. Consulta a nossa
            localização e os horários dos cultos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Localização */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6 text-blue-700"
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

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Contactos
              </h4>
              <p className="text-sm text-gray-700">
                {IGREJA.contactos.telefone}
              </p>
              <p className="text-sm text-gray-700">
                {IGREJA.contactos.email}
              </p>
            </div>
          </div>

          {/* Cultos */}
          <div className="bg-white rounded-xl border border-gray-100 p-8">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
              <svg
                className="w-6 h-6 text-blue-700"
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

            <h3 className="text-lg font-semibold text-gray-900">
              Horários dos Cultos
            </h3>

            <ul className="mt-4 divide-y divide-gray-100">
              {CULTOS.map((culto) => (
                <li
                  key={culto.nome}
                  className="py-3.5 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {culto.nome}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {culto.dia}
                    </p>
                  </div>
                  <p className="text-sm text-blue-700 font-medium whitespace-nowrap">
                    {culto.inicio} — {culto.fim}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}