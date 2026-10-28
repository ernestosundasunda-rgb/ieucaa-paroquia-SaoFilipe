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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Barra azul — Voltar ao painel */}
      <div style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#FFFFFF' }}
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
            Voltar ao painel
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-10 px-4">
        {/* Cartão principal */}
        <div className="bg-white rounded-[18px] border border-[#E2E8F0] overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          {/* Cabeçalho do card — azul escuro */}
          <div
            className="relative px-8 py-10 text-white overflow-hidden"
            style={{ backgroundColor: 'var(--color-primary-dark)' }}
          >
            {/* Círculos decorativos */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute top-4 right-6 w-12 h-px bg-white/30" />

            <div className="relative flex items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                {profile.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.foto_url}
                    alt={profile.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: '#FFFFFF' }}
                  >
                    {profile.nome.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Nome + email */}
              <div className="min-w-0 flex-1">
                <h1
                  className="text-xl font-bold tracking-tight truncate"
                  style={{ color: '#FFFFFF' }}
                >
                  {profile.nome}
                </h1>
                <p
                  className="text-[13px] mt-1 truncate"
                  style={{ color: 'rgba(255, 255, 255, 0.75)' }}
                >
                  {profile.email}
                </p>

                <span
                  className="inline-block mt-3 text-[10px] font-bold tracking-[0.12em] uppercase bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full"
                  style={{ color: '#FFFFFF' }}
                >
                  {profile.role}
                </span>
              </div>
            </div>
          </div>

          {/* Corpo com dados */}
          <div className="px-8 py-8">
            <dl className="divide-y divide-[#E2E8F0]">
              {campos.map((campo) => (
                <div
                  key={campo.label}
                  className="flex items-center py-3.5 transition-colors duration-150 hover:bg-[#F8FAFC]/50"
                >
                  <dt className="w-44 text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
                    {campo.label}
                  </dt>
                  <dd
                    className={`flex-1 text-[14px] text-[#0F172A] ${
                      campo.capitalizar ? 'capitalize' : ''
                    }`}
                  >
                    {campo.valor}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Botão editar — azul escuro */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-end">
              <Link
                href="/perfil/editar"
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-[10px] text-[14px] font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-primary-dark)',
                  color: '#FFFFFF',
                }}
              >
                Editar perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}