'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
  const [scrolled, setScrolled] = useState(false)
  const naHome = pathname === '/'

  useEffect(() => {
    if (!naHome) return

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

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

  function handleClickSecao(
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    if (!naHome) return
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMenuAberto(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 shadow-[0_4px_20px_rgba(13,110,253,0.25)]'
          : 'border-b border-transparent'
      }`}
      style={{ backgroundColor: 'var(--color-primary)' }}
    >
      <nav className="container h-[72px] flex items-center justify-between">
        {/* Logo + Nome */}
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logotipo IEUCAA"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div className="hidden sm:block min-w-0">
            <p
              className="text-[14px] font-bold leading-tight tracking-tight truncate"
              style={{ color: '#FFFFFF' }}
            >
              Direção da Juventude
            </p>
            <p
              className="text-[11px] leading-tight truncate"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              IEUCAA · Paróquia de São Filipe
            </p>
          </div>
        </Link>

        {/* Links — desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => {
            const ativo = naHome && secaoAtiva === l.id
            const conteudo = (
              <>
                <span style={{ color: '#FFFFFF' }}>{l.label}</span>
                {ativo && (
                  <span
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5"
                    style={{ backgroundColor: '#D6A84F' }}
                  />
                )}
              </>
            )

            return naHome ? (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleClickSecao(e, l.id)}
                className="relative text-[14px] font-medium transition-opacity duration-200 hover:opacity-80"
              >
                {conteudo}
              </a>
            ) : (
              <Link
                key={l.href}
                href={`/${l.href}`}
                className="relative text-[14px] font-medium transition-opacity duration-200 hover:opacity-80"
              >
                <span style={{ color: '#FFFFFF' }}>{l.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Botão Entrar — desktop (azul escuro com texto branco) */}
        <div className="hidden lg:flex items-center gap-3">
          {logado ? (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center min-h-[40px] px-5 rounded-[10px] text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-primary-dark)',
                color: '#FFFFFF',
              }}
            >
              Painel
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center min-h-[40px] px-5 rounded-[10px] text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-primary-dark)',
                color: '#FFFFFF',
              }}
            >
              Entrar
            </Link>
          )}
        </div>

        {/* Botão menu mobile */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="lg:hidden p-2 transition-opacity hover:opacity-80"
          style={{ color: '#FFFFFF' }}
          aria-label="Abrir menu"
        >
          {menuAberto ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuAberto && (
        <div
          className="lg:hidden border-t border-white/10"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <div className="container py-5 flex flex-col gap-1">
            {LINKS.map((l) =>
              naHome ? (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleClickSecao(e, l.id)}
                  className="text-[14px] font-medium transition-opacity duration-200 hover:opacity-80 py-3 px-3 rounded-md"
                  style={{ color: '#FFFFFF' }}
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={`/${l.href}`}
                  onClick={() => setMenuAberto(false)}
                  className="text-[14px] font-medium transition-opacity duration-200 hover:opacity-80 py-3 px-3 rounded-md"
                  style={{ color: '#FFFFFF' }}
                >
                  {l.label}
                </Link>
              )
            )}

            <div className="pt-4 mt-2 border-t border-white/10">
              {logado ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMenuAberto(false)}
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-5 rounded-[10px] text-[14px] font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--color-primary-dark)',
                    color: '#FFFFFF',
                  }}
                >
                  Painel
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuAberto(false)}
                  className="w-full inline-flex items-center justify-center min-h-[44px] px-5 rounded-[10px] text-[14px] font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--color-primary-dark)',
                    color: '#FFFFFF',
                  }}
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