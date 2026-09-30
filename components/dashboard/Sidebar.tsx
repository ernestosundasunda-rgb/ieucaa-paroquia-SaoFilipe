'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { UserRole } from '@/types'
import {
  IconDashboard,
  IconUser,
  IconUsers,
  IconNews,
  IconShield,
  IconHome,
} from '@/components/icons'

interface SidebarProps {
  role: UserRole
  nome: string
}

export default function Sidebar({ role, nome }: SidebarProps) {
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const ativo = pathname === href || pathname.startsWith(href + '/')
    return `group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      ativo
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
    }`
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-screen flex flex-col">
     
         {/* Marca */}
<div className="px-6 py-6 border-b border-gray-100">
  <div className="flex items-center gap-3 mb-3">
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white border border-gray-100">
      <Image
        src="/logo.png"
        alt="Logotipo"
        width={40}
        height={40}
        className="w-full h-full object-contain"
      />
    </div>
    <div className="min-w-0">
      <h2 className="text-sm font-semibold text-gray-900 tracking-tight truncate">
        Painel
      </h2>
      <p className="text-[11px] text-gray-500 truncate">IEUCAA</p>
    </div>
  </div>

  <p className="text-sm text-gray-500 truncate">{nome}</p>
  <span className="inline-block mt-1.5 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">
    {role}
  </span>
</div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link href="/admin/dashboard" className={linkClass('/admin/dashboard')}>
          <IconDashboard />
          <span>Dashboard</span>
        </Link>

        <Link href="/perfil" className={linkClass('/perfil')}>
          <IconUser />
          <span>Meu Perfil</span>
        </Link>

        {(role === 'admin' || role === 'superadmin') && (
  <>
    <p className="pt-5 pb-2 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
      Gestão
    </p>

    <Link href="/admin/membros" className={linkClass('/admin/membros')}>
      <IconUsers />
      <span>Membros</span>
    </Link>

    <Link href="/admin/noticias" className={linkClass('/admin/noticias')}>
      <IconNews />
      <span>Notícias</span>
    </Link>

    <Link href="/admin/financeiro" className={linkClass('/admin/financeiro')}>
      <IconFinanceiro />
      <span>Financeiro</span>
    </Link>
  </>
)}
        {role === 'superadmin' && (
  <>
    <p className="pt-5 pb-2 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
      Sistema
    </p>

    <Link href="/admin/usuarios" className={linkClass('/admin/usuarios')}>
      <IconShield />
      <span>Usuários</span>
    </Link>

    <Link href="/admin/relatorios" className={linkClass('/admin/relatorios')}>
      <IconRelatorio />
      <span>Relatórios</span>
    </Link>
  </>
)}
      </nav>

      {/* Rodapé */}
      <div className="px-3 py-4 border-t border-gray-100">
        <Link
          href="/"
          className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
        >
          <IconHome />
          <span>Ir para o site</span>
        </Link>
      </div>
    </aside>
  )
}
function IconRelatorio({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}

function IconFinanceiro({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}