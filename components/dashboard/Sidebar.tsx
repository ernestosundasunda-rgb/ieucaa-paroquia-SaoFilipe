'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { UserRole } from '@/types'
import {
  IconDashboard,
  IconUser,
  IconUsers,
  IconNews,
  IconShield,
  IconHome,
  IconFinanceiro,
  IconRelatorio,
} from '@/components/icons'

interface SidebarProps {
  role: UserRole
  nome: string
}

export default function Sidebar({ role, nome }: SidebarProps) {
  const pathname = usePathname()

  const isAtivo = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const sectionLabel =
    'pt-5 pb-2 px-4 text-[10px] uppercase tracking-[0.15em] font-bold'

  return (
    <aside
      className="w-64 min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-primary-dark)' }}
    >
      {/* Marca */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Logotipo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              className="text-[13px] font-bold leading-tight truncate"
              style={{ color: '#FFFFFF' }}
            >
              Direção da Juventude
            </p>
            <p
              className="text-[10px] leading-tight truncate"
              style={{ color: 'rgba(255, 255, 255, 0.55)' }}
            >
              IEUCAA · São Filipe
            </p>
          </div>
        </div>

        {/* Info utilizador */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <span
                className="text-[13px] font-bold"
                style={{ color: '#FFFFFF' }}
              >
                {nome.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p
                className="text-[12px] font-medium truncate"
                style={{ color: '#FFFFFF' }}
              >
                {nome}
              </p>
              <span
                className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                }}
              >
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <LinkItem
          href="/admin/dashboard"
          label="Dashboard"
          Icone={IconDashboard}
          ativo={isAtivo('/admin/dashboard')}
        />

        <LinkItem
          href="/perfil"
          label="Meu Perfil"
          Icone={IconUser}
          ativo={isAtivo('/perfil')}
        />

        {(role === 'admin' || role === 'superadmin') && (
          <>
            <p
              className={sectionLabel}
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              Gestão
            </p>

            <LinkItem
              href="/admin/membros"
              label="Membros"
              Icone={IconUsers}
              ativo={isAtivo('/admin/membros')}
            />
            <LinkItem
              href="/admin/noticias"
              label="Notícias"
              Icone={IconNews}
              ativo={isAtivo('/admin/noticias')}
            />
            <LinkItem
              href="/admin/financeiro"
              label="Financeiro"
              Icone={IconFinanceiro}
              ativo={isAtivo('/admin/financeiro')}
            />
          </>
        )}

        {role === 'superadmin' && (
          <>
            <p
              className={sectionLabel}
              style={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              Sistema
            </p>

            <LinkItem
              href="/admin/usuarios"
              label="Usuários"
              Icone={IconShield}
              ativo={isAtivo('/admin/usuarios')}
            />
            <LinkItem
              href="/admin/relatorios"
              label="Relatórios"
              Icone={IconRelatorio}
              ativo={isAtivo('/admin/relatorios')}
            />
          </>
        )}
      </nav>

      {/* Rodapé — botão "Ir para o site" */}
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          className="group flex items-center justify-center gap-2 min-h-[42px] px-4 rounded-full text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
          }}
        >
          <IconHome className="w-4 h-4" />
          <span>Ir para o site</span>
        </Link>
      </div>
    </aside>
  )
}

/* Item de link com ícone + texto sempre branco */
function LinkItem({
  href,
  label,
  Icone,
  ativo,
}: {
  href: string
  label: string
  Icone: (props: { className?: string }) => React.ReactElement
  ativo: boolean
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
        ativo
          ? 'bg-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
          : 'hover:bg-white/10'
      }`}
    >
      <span
        className="flex-shrink-0"
        style={{ color: ativo ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' }}
      >
        <Icone className="w-[18px] h-[18px]" />
      </span>
      <span
        style={{ color: ativo ? '#FFFFFF' : 'rgba(255, 255, 255, 0.75)' }}
        className="group-hover:text-white transition-colors duration-200"
      >
        {label}
      </span>
    </Link>
  )
}