'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  imagemAtual: string | null
  onImagemMudou: (url: string | null) => void
  noticiaId?: string
}

export default function ImagemNoticiaUpload({
  imagemAtual,
  onImagemMudou,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(imagemAtual)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setErro('')

    // Validações
    if (!file.type.startsWith('image/')) {
      setErro('O ficheiro deve ser uma imagem.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErro('A imagem não pode ter mais de 5MB.')
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload para Supabase Storage
    setLoading(true)
    const supabase = createClient()

    // Nome único: timestamp + nome original sanitizado
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const nomeSeguro = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`
    const path = `${nomeSeguro}`

    const { error: uploadError } = await supabase.storage
      .from('noticias')
      .upload(path, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setErro('Erro no upload: ' + uploadError.message)
      setLoading(false)
      return
    }

    // URL público
    const { data: urlData } = supabase.storage
      .from('noticias')
      .getPublicUrl(path)

    const novaUrl = urlData.publicUrl

    setPreview(novaUrl)
    onImagemMudou(novaUrl)
    setLoading(false)
  }

  async function handleRemover() {
    if (!preview) return

    setErro('')
    setLoading(true)

    // Tentar extrair o path do URL público
    const supabase = createClient()
    const path = preview.split('/noticias/').pop()?.split('?')[0]

    if (path) {
      await supabase.storage.from('noticias').remove([path])
    }

    setPreview(null)
    onImagemMudou(null)
    setLoading(false)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Imagem de capa
      </label>

      {preview ? (
        <div className="relative group rounded-lg overflow-hidden border border-gray-200">
          <div className="aspect-video bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Pré-visualização"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="bg-white text-gray-900 text-xs font-medium px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-150 disabled:opacity-60"
            >
              {loading ? 'A enviar...' : 'Alterar'}
            </button>
            <button
              type="button"
              onClick={handleRemover}
              disabled={loading}
              className="bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-150 disabled:opacity-60"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            {loading ? (
              <svg
                className="w-5 h-5 text-gray-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <p className="text-sm font-medium text-gray-700">
            {loading ? 'A enviar...' : 'Carregar imagem'}
          </p>
          <p className="text-xs text-gray-400">PNG, JPG ou WebP · máx. 5MB</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {erro && (
        <p className="mt-2 text-xs text-red-600">{erro}</p>
      )}
    </div>
  )
}