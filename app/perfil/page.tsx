import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserWithProfile } from '@/lib/auth/getUser'

export default async function PerfilPage() {
  const { user, profile } = await getUserWithProfile()

  if (!user || !profile) {
    redirect('/auth/login')
  }

  const campos: { label: string; valor: string; capitalizar?: boolean }[] = [
    { label: 'Nome', valor: profile.nome },
    { label: 'Email', valor: profile.email },
    { label: 'Telefone', valor: profile.telefone || '—' },
    { label: 'Endereço', valor: profile.endereco || '—' },
    { label: 'Cargo', valor: profile.cargo || '—' },
    { label: 'Nível de Acesso', valor: profile.role, capitalizar: true },
    { label: 'Data de Nascimento', valor: profile.data_nascimento || '—' },
    { label: 'Data de Batismo', valor: profile.data_batismo || '—' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Link para voltar ao painel */}
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar ao Painel
        </Link>

        {/* Avatar + Nome */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
            {profile.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.foto_url}
                alt={profile.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-blue-600">
                {profile.nome.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {profile.nome}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{profile.email}</p>
          </div>

          <Link
            href="/perfil/editar"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30"
          >
            Editar Perfil
          </Link>
        </div>

        {/* Dados */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <dl className="divide-y divide-gray-100">
            {campos.map((campo) => (
              <div
                key={campo.label}
                className="flex items-center px-6 py-4 transition-colors duration-150 hover:bg-gray-50"
              >
                <dt className="w-48 text-sm font-medium text-gray-500">
                  {campo.label}
                </dt>
                <dd
                  className={`flex-1 text-sm text-gray-900 ${
                    campo.capitalizar ? 'capitalize' : ''
                  }`}
                >
                  {campo.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}