'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  fotoAtual: string | null
  nome: string
}

export default function AvatarUpload({ userId, fotoAtual, nome }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(fotoAtual)
  const [loading, setLoading] = useState(false)
  const [aRemover, setARemover] = useState(false)
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

    if (file.size > 2 * 1024 * 1024) {
      setErro('A imagem não pode ter mais de 2MB.')
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Upload
    setLoading(true)
    const supabase = createClient()

    // Nome único para o ficheiro
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}/avatar.${ext}`

    // Remover ficheiros antigos
    await supabase.storage.from('avatares').remove([
      `${userId}/avatar.jpg`,
      `${userId}/avatar.png`,
      `${userId}/avatar.jpeg`,
      `${userId}/avatar.webp`,
    ])

    // Upload novo
    const { error: uploadError } = await supabase.storage
      .from('avatares')
      .upload(path, file, { upsert: true, cacheControl: '3600' })

    if (uploadError) {
      setErro('Erro no upload: ' + uploadError.message)
      setLoading(false)
      return
    }

    // URL público com timestamp para evitar cache
    const { data: urlData } = supabase.storage
      .from('avatares')
      .getPublicUrl(path)

    const novaUrl = `${urlData.publicUrl}?v=${Date.now()}`

    // Atualizar perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ foto_url: novaUrl })
      .eq('id', userId)

    if (updateError) {
      setErro('Erro ao guardar: ' + updateError.message)
      setLoading(false)
      return
    }

    setPreview(novaUrl)
    setLoading(false)
    window.location.reload()
  }

  async function handleRemover() {
    setErro('')
    setARemover(true)

    const supabase = createClient()

    // Remover do storage
    const { error: storageError } = await supabase.storage
      .from('avatares')
      .remove([
        `${userId}/avatar.jpg`,
        `${userId}/avatar.png`,
        `${userId}/avatar.jpeg`,
        `${userId}/avatar.webp`,
      ])

    if (storageError) {
      setErro('Erro ao remover ficheiro: ' + storageError.message)
      setARemover(false)
      return
    }

    // Atualizar perfil (foto_url = null)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ foto_url: null })
      .eq('id', userId)

    if (updateError) {
      setErro('Erro ao atualizar perfil: ' + updateError.message)
      setARemover(false)
      return
    }

    setPreview(null)
    setARemover(false)
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-28 h-28 rounded-full bg-blue-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-semibold text-blue-600">
              {nome.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Overlay hover */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading || aRemover}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <span className="text-white text-xs font-medium">
            {loading ? 'A enviar...' : 'Alterar foto'}
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
          disabled={loading || aRemover}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-150 disabled:opacity-60"
        >
          {loading ? 'A enviar...' : 'Alterar foto'}
        </button>

        {preview && (
          <>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={handleRemover}
              disabled={loading || aRemover}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-150 disabled:opacity-60"
            >
              {aRemover ? 'A remover...' : 'Remover foto'}
            </button>
          </>
        )}
      </div>

      {erro && (
        <p className="mt-2 text-xs text-red-600 text-center max-w-[240px]">
          {erro}
        </p>
      )}

      <p className="mt-2 text-xs text-gray-400">PNG ou JPG, máx. 2MB</p>
    </div>
  )
}