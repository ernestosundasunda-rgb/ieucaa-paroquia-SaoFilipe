import Link from 'next/link'
import { IGREJA, CULTOS } from '@/lib/constants'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Coluna 1 — Igreja */}
          <div>
            <h3 className="text-base font-semibold mb-3">{IGREJA.nome}</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              {IGREJA.nomeCompleto}
            </p>
            <p className="text-sm text-blue-200 mt-4 italic">
              {IGREJA.slogan}
            </p>
          </div>

          {/* Coluna 2 — Navegação */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-blue-100 hover:text-white transition-colors duration-150"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias"
                  className="text-sm text-blue-100 hover:text-white transition-colors duration-150"
                >
                  Notícias
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-sm text-blue-100 hover:text-white transition-colors duration-150"
                >
                  Sobre a Igreja
                </Link>
              </li>
              <li>
                <Link
                  href="/contactos"
                  className="text-sm text-blue-100 hover:text-white transition-colors duration-150"
                >
                  Contactos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3 — Localização + Contactos */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-4">
              Onde Estamos
            </h4>
            <address className="not-italic text-sm text-blue-100 leading-relaxed">
              <p>{IGREJA.localizacao.provincia}</p>
              <p>{IGREJA.localizacao.bairro}</p>
              <p className="text-blue-200 text-xs mt-1">
                {IGREJA.localizacao.referencia}
              </p>
            </address>

            <div className="mt-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-blue-200 mb-3">
                Contactos
              </h4>
              <p className="text-sm text-blue-100">
                {IGREJA.contactos.telefone}
              </p>
              <p className="text-sm text-blue-100">
                {IGREJA.contactos.email}
              </p>
            </div>
          </div>
        </div>

        {/* Cultos — linha horizontal */}
        <div className="mt-10 pt-8 border-t border-blue-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-4">
            Horários dos Cultos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CULTOS.map((culto) => (
              <div key={culto.nome}>
                <p className="text-xs font-medium text-white">{culto.nome}</p>
                <p className="text-xs text-blue-200 mt-1">
                  {culto.dia}
                </p>
                <p className="text-xs text-blue-300">
                  {culto.inicio} — {culto.fim}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-blue-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-blue-200 text-center md:text-left">
            © {ano} {IGREJA.nome}. Todos os direitos reservados.
          </p>
          <p className="text-xs text-blue-300">
            {IGREJA.sigla} · {IGREJA.localizacao.pais}
          </p>
        </div>
      </div>
    </footer>
  )
}