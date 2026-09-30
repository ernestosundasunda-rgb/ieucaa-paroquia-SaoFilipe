'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImagemNoticiaUpload from './ImagemNoticiaUpload'
import type { Noticia } from '@/types'

interface Props {
  noticia?: Noticia
  autorId: string
  autorNome: string
}

const CATEGORIAS = [
  'geral',
  'eventos',
  'avisos',
  'testemunhos',
  'estudos',
  'jovens',
]

export default function NoticiaForm({
  noticia,
  autorId,
  autorNome,
}: Props) {
  const router = useRouter()
  const editando = !!noticia

  const [form, setForm] = useState({
    titulo: noticia?.titulo ?? '',
    conteudo: noticia?.conteudo ?? '',
    categoria: noticia?.categoria ?? 'geral',
    data_publicacao:
      noticia?.data_publicacao ?? new Date().toISOString().split('T')[0],
  })

  const [imagemUrl, setImagemUrl] = useState<string | null>(
    noticia?.imagem_url ?? null
  )

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!form.titulo.trim()) {
      setErro('O título é obrigatório.')
      return
    }

    if (!form.conteudo.trim()) {
      setErro('O conteúdo é obrigatório.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const dados = {
      titulo: form.titulo.trim(),
      conteudo: form.conteudo.trim(),
      categoria: form.categoria,
      data_publicacao: form.data_publicacao,
      imagem_url: imagemUrl,
      autor_id: autorId,
      autor_nome: autorNome,
    }

    const { error } = editando
      ? await supabase.from('noticias').update(dados).eq('id', noticia!.id)
      : await supabase.from('noticias').insert(dados)

    if (error) {
      setErro('Erro: ' + error.message)
      setLoading(false)
      return
    }

    router.push('/admin/noticias')
    router.refresh()
  }

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Imagem de capa */}
      <ImagemNoticiaUpload
        imagemAtual={noticia?.imagem_url ?? null}
        onImagemMudou={setImagemUrl}
      />

      {/* Título */}
      <div>
        <label className={labelClass}>Título *</label>
        <input
          type="text"
          name="titulo"
          required
          value={form.titulo}
          onChange={handleChange}
          placeholder="Título da notícia"
          className={inputClass}
        />
      </div>

      {/* Categoria + Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Categoria</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Data de Publicação</label>
          <input
            type="date"
            name="data_publicacao"
            value={form.data_publicacao}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div>
        <label className={labelClass}>Conteúdo *</label>
        <textarea
          name="conteudo"
          required
          rows={12}
          value={form.conteudo}
          onChange={handleChange}
          placeholder="Escreve aqui o conteúdo da notícia..."
          className={`${inputClass} resize-y font-normal leading-relaxed`}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Dica: podes usar quebras de linha para separar parágrafos.
        </p>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/admin/noticias"
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30"
        >
          {loading
            ? 'A guardar...'
            : editando
            ? 'Guardar Alterações'
            : 'Publicar Notícia'}
        </button>
      </div>
    </form>
  )
}