import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import CabecalhoIgreja from '@/components/documentos/CabecalhoIgreja'
import BotaoExportarFicha from '@/components/documentos/BotaoExportarFicha'
import { calcularIdade, formatarData } from '@/lib/utils'
import type { Membro } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FichaMembroPage({ params }: Props) {
  const { id } = await params
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()
  const { data: membro } = await supabase
    .from('membros')
    .select('*')
    .eq('id', id)
    .single()

  if (!membro) {
    notFound()
  }

  const m = membro as Membro
  const idade = calcularIdade(m.data_nascimento)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar (não aparece no PDF) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/admin/membros"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150"
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
          Voltar aos membros
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/membros/editar/${m.id}`}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors duration-150"
          >
            Editar
          </Link>
          <BotaoExportarFicha membro={m} />
        </div>
      </div>

      {/* Documento (formato A4 — este é o que vai para PDF) */}
      <div
        id="ficha-para-pdf"
        className="bg-white rounded-xl border border-gray-100 p-10 shadow-sm"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Cabeçalho institucional */}
        <CabecalhoIgreja />

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-blue-950 uppercase tracking-widest">
            Ficha de Cadastro de Membro
          </h2>
          <div className="mt-2 w-24 h-0.5 bg-blue-900 mx-auto" />
        </div>

        {/* Foto + Dados principais */}
        <div className="flex gap-8 mb-8">
          {/* Foto */}
          <div className="flex-shrink-0">
            <div className="w-40 h-48 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center overflow-hidden">
              {m.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.foto_url}
                  alt={m.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center px-2">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Fotografia
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dados principais */}
          <div className="flex-1 space-y-3">
            <Campo label="Nome completo" valor={m.nome} destaque />
            <Campo label="Nº do Bilhete de Identidade" valor={m.bi || '—'} mono />
            <div className="grid grid-cols-2 gap-3">
              <Campo
                label="Data de Nascimento"
                valor={formatarData(m.data_nascimento)}
              />
              <Campo
                label="Idade"
                valor={idade !== null ? `${idade} anos` : '—'}
              />
            </div>
            <Campo
              label="Tipo Sanguíneo"
              valor={
                m.tipo_sanguineo && m.tipo_sanguineo !== 'desconhecido'
                  ? m.tipo_sanguineo
                  : '—'
              }
            />
          </div>
        </div>

        {/* Divisão */}
        <div className="border-t border-gray-200 my-6" />

        {/* Dados espirituais */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4">
            Informação Eclesiástica
          </h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <Campo
              label="Data de Batismo"
              valor={formatarData(m.data_batismo)}
            />
            <Campo
              label="Data de Confirmação"
              valor={formatarData(m.data_confirmacao)}
            />
            <Campo label="Cargo Ministerial" valor={m.cargo || '—'} />
            <Campo label="Membro desde" valor={formatarData(m.created_at)} />
          </div>
        </div>

        {/* Divisão */}
        <div className="border-t border-gray-200 my-6" />

        {/* Contactos */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4">
            Contactos
          </h3>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <Campo label="Telefone" valor={m.telefone || '—'} />
            <Campo label="Email" valor={m.email || '—'} />
            <div className="col-span-2">
              <Campo label="Endereço" valor={m.endereco || '—'} />
            </div>
          </div>
        </div>

        {/* Assinaturas */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-16">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="text-xs text-gray-600 uppercase tracking-wider">
                  O Membro
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{m.nome}</p>
              </div>
            </div>

            <div className="text-center">
              <div className="border-t border-gray-400 pt-2 mt-12">
                <p className="text-xs text-gray-600 uppercase tracking-wider">
                  O Responsável da Paróquia
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-12 pt-5 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Documento emitido em {formatarData(new Date().toISOString())}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Paróquia de São Filipe — Papelão, Uíge · Angola
          </p>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   COMPONENTE: Campo formatado
   ============================================ */
function Campo({
  label,
  valor,
  destaque = false,
  mono = false,
}: {
  label: string
  valor: string
  destaque?: boolean
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm text-gray-900 border-b border-gray-200 pb-1 ${
          destaque ? 'font-bold text-base' : ''
        } ${mono ? 'font-mono tracking-wider' : ''}`}
      >
        {valor}
      </p>
    </div>
  )
}