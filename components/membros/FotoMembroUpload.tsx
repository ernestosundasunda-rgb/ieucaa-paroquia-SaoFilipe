'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  fotoAtual: string | null
  onFotoMudou: (url: string | null) => void
  nome: string
}

export default function FotoMembroUpload({
  fotoAtual,
  onFotoMudou,
  nome,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(fotoAtual)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setErro('')

    if (!file.type.startsWith('image/')) {
      setErro('O ficheiro deve ser uma imagem.')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setErro('A imagem não pode ter mais de 3MB.')
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    setLoading(true)
    const supabase = createClient()

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const nomeSeguro = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('membros')
      .upload(nomeSeguro, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setErro('Erro no upload: ' + uploadError.message)
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('membros')
      .getPublicUrl(nomeSeguro)

    const novaUrl = urlData.publicUrl
    setPreview(novaUrl)
    onFotoMudou(novaUrl)
    setLoading(false)
  }

  async function handleRemover() {
    if (!preview) return

    setErro('')
    setLoading(true)

    const supabase = createClient()
    const path = preview.split('/membros/').pop()?.split('?')[0]

    if (path) {
      await supabase.storage.from('membros').remove([path])
    }

    setPreview(null)
    onFotoMudou(null)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-semibold text-blue-600">
              {nome ? nome.charAt(0).toUpperCase() : '?'}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <span className="text-white text-xs font-medium">
            {loading ? 'A enviar...' : 'Alterar'}
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150 disabled:opacity-60"
        >
          {loading ? 'A enviar...' : preview ? 'Alterar foto' : 'Carregar foto'}
        </button>

        {preview && (
          <>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={handleRemover}
              disabled={loading}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-150 disabled:opacity-60"
            >
              Remover
            </button>
          </>
        )}
      </div>

      {erro && (
        <p className="mt-2 text-xs text-red-600 text-center max-w-[240px]">
          {erro}
        </p>
      )}

      <p className="mt-1 text-xs text-gray-400">PNG ou JPG, máx. 3MB</p>
    </div>
  )
}