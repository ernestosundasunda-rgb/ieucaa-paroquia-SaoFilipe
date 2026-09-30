import { getUserWithProfile } from '@/lib/auth/getUser'
import { createClient } from '@/lib/supabase/server'
import { IconUsers, IconNews, IconShield } from '@/components/icons'

export default async function DashboardPage() {
  const { profile } = await getUserWithProfile()
  const supabase = await createClient()

  const [{ count: totalMembros }, { count: totalNoticias }] = await Promise.all([
    supabase.from('membros').select('*', { count: 'exact', head: true }),
    supabase.from('noticias').select('*', { count: 'exact', head: true }),
  ])

  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Visão geral do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          titulo="Total de Membros"
          valor={totalMembros ?? 0}
          Icone={IconUsers}
        />
        <StatCard
          titulo="Notícias Publicadas"
          valor={totalNoticias ?? 0}
          Icone={IconNews}
        />
        <StatCard
          titulo="Nível de Acesso"
          valor={profile?.role ?? 'member'}
          Icone={IconShield}
          capitalizar
        />
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">
          Informações
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {isAdmin
            ? 'Tens permissões de administrador. Podes gerir membros e notícias.'
            : 'Bem-vindo ao teu painel. Aqui podes ver e editar o teu perfil.'}
        </p>
      </div>
    </div>
  )
}

function StatCard({
  titulo,
  valor,
  Icone,
  capitalizar = false,
}: {
  titulo: string
  valor: string | number
  Icone: (props: { className?: string }) => React.ReactElement
  capitalizar?: boolean
}) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-6 transition-all duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-600/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{titulo}</p>
          <p
            className={`text-3xl font-semibold text-gray-900 mt-2 tracking-tight ${
              capitalizar ? 'capitalize' : ''
            }`}
          >
            {valor}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white">
          <Icone className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}