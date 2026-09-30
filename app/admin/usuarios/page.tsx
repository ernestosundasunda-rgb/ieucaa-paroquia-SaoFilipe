import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import AlterarRoleButton from '@/components/usuarios/AlterarRoleButton'
import DeleteUsuarioButton from '@/components/usuarios/DeleteUsuarioButton'
import type { Profile } from '@/types'

export default async function UsuariosPage() {
  const { profile } = await getUserWithProfile()

  // Apenas superadmin pode acessar
  if (!profile || profile.role !== 'superadmin') {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()
  const { data: usuarios } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const total = usuarios?.length ?? 0
  const totalAdmins =
    usuarios?.filter(
      (u) => u.role === 'admin' || u.role === 'superadmin'
    ).length ?? 0
  const totalSuperadmins =
    usuarios?.filter((u) => u.role === 'superadmin').length ?? 0

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Gestão de Usuários
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerir níveis de acesso e remover usuários do sistema
        </p>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatMini label="Total de Usuários" valor={total} />
        <StatMini label="Admins + Superadmins" valor={totalAdmins} />
        <StatMini label="Superadmins" valor={totalSuperadmins} />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!usuarios || usuarios.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">Sem usuários registados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Utilizador
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Nível
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Registo
                  </th>
                  <th className="text-right px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((u: Profile) => {
                  const euProprio = u.id === profile.id
                  const alvoSuperadmin = u.role === 'superadmin'

                  return (
                    <tr
                      key={u.id}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {u.foto_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={u.foto_url}
                                alt={u.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-blue-600">
                                {u.nome.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {u.nome}
                              {euProprio && (
                                <span className="ml-2 text-xs text-blue-600 font-normal">
                                  (tu)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                            u.role === 'superadmin'
                              ? 'bg-blue-600 text-white'
                              : u.role === 'admin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(u.created_at).toLocaleDateString('pt-PT')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <AlterarRoleButton
                            userId={u.id}
                            roleAtual={u.role}
                            meuUserId={profile.id}
                            roleAlvoEhSuperadmin={alvoSuperadmin}
                          />
                          <DeleteUsuarioButton
                            userId={u.id}
                            nome={u.nome}
                            meuUserId={profile.id}
                            roleAlvoEhSuperadmin={alvoSuperadmin}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aviso */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">
          Notas de segurança
        </h3>
        <ul className="text-xs text-blue-700 space-y-1 leading-relaxed">
          <li>• Não podes alterar o teu próprio nível de acesso.</li>
          <li>• O nível de superadmins está protegido contra alterações.</li>
          <li>
            • Eliminar um usuário remove o perfil, mas o login em si permanece
          </li>
        </ul>
      </div>
    </div>
  )
}

function StatMini({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 transition-all duration-200 hover:border-blue-200 hover:shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className="text-2xl font-semibold text-gray-900 mt-1.5 tracking-tight">
        {valor}
      </p>
    </div>
  )
}