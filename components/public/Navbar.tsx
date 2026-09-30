'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IGREJA } from '@/lib/constants'
import Image from 'next/image'

interface Props {
  logado: boolean
}

const LINKS = [
  { href: '#inicio', label: 'Início', id: 'inicio' },
  { href: '#noticias', label: 'Notícias', id: 'noticias' },
  { href: '#sobre', label: 'Sobre', id: 'sobre' },
  { href: '#cultos', label: 'Cultos', id: 'cultos' },
  { href: '#contactos', label: 'Contactos', id: 'contactos' },
]

export default function Navbar({ logado }: Props) {
  const pathname = usePathname()
  const [menuAberto, setMenuAberto] = useState(false)
  const [secaoAtiva, setSecaoAtiva] = useState('inicio')
  const naHome = pathname === '/'

  // Deteta a secção ativa ao fazer scroll (só na home)
  useEffect(() => {
    if (!naHome) return

    const handleScroll = () => {
      const scrollY = window.scrollY + 120

      for (const link of LINKS) {
        const el = document.getElementById(link.id)
        if (!el) continue

        const top = el.offsetTop
        const bottom = top + el.offsetHeight

        if (scrollY >= top && scrollY < bottom) {
          setSecaoAtiva(link.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [naHome])

  // Clicar num link de secção
  function handleClickSecao(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    // Se NÃO estamos na home → deixar o browser ir para /#id
    if (!naHome) return

    // Se estamos na home → scroll suave sem mudar URL
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMenuAberto(false)
  }

  const linkClass = (id: string) => {
    const ativo = naHome && secaoAtiva === id
    return `text-sm font-medium transition-colors duration-150 ${
      ativo ? 'text-blue-900' : 'text-gray-600 hover:text-blue-900'
    }`
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + Nome */}
       
       {/* Logo + Nome */}
<Link href="/" className="flex items-center gap-3 min-w-0">
  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white">
    <Image
      src="/logo.png"
      alt="Logotipo"
      width={40}
      height={40}
      className="w-full h-full object-contain"
    />
  </div>
  <div className="hidden sm:block min-w-0">
    <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
      {IGREJA.nome}
    </p>
    <p className="text-[11px] text-gray-500 leading-tight truncate">
      {IGREJA.sigla} · Uíge
    </p>
  </div>
</Link>

        {/* Links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) =>
            naHome ? (
              // Na home → âncora normal (scroll suave)
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleClickSecao(e, l.id)}
                className={linkClass(l.id)}
              >
                {l.label}
              </a>
            ) : (
              // Fora da home → link normal com href="/#id"
              <Link
                key={l.href}
                href={`/${l.href}`}
                className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors duration-150"
              >
                {l.label}
              </Link>
            )
          )}
        </div>

        {/* Botão direito — desktop */}
        <div className="hidden md:flex items-center gap-3">
          {logado ? (
            <Link
              href="/admin/dashboard"
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm shadow-blue-900/20 hover:shadow-md"
            >
              Painel
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm shadow-blue-900/20 hover:shadow-md"
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Botão menu mobile */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden p-2 text-gray-600 hover:text-blue-900 transition-colors"
          aria-label="Menu"
        >
          {menuAberto ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 flex flex-col gap-4">
            {LINKS.map((l) =>
              naHome ? (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleClickSecao(e, l.id)}
                  className={linkClass(l.id)}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={`/${l.href}`}
                  onClick={() => setMenuAberto(false)}
                  className="text-sm font-medium text-gray-600 hover:text-blue-900 transition-colors duration-150"
                >
                  {l.label}
                </Link>
              )
            )}

            <div className="pt-3 border-t border-gray-100">
              {logado ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMenuAberto(false)}
                  className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-200"
                >
                  Painel
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuAberto(false)}
                  className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors duration-200"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}