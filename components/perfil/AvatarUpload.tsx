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

    if (!file.type.startsWith('image/')) {
      setErro('O ficheiro deve ser uma imagem.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErro('A imagem não pode ter mais de 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)

    setLoading(true)
    const supabase = createClient()

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}/avatar.${ext}`

    await supabase.storage.from('avatares').remove([
      `${userId}/avatar.jpg`,
      `${userId}/avatar.png`,
      `${userId}/avatar.jpeg`,
      `${userId}/avatar.webp`,
    ])

    const { error: uploadError } = await supabase.storage
      .from('avatares')
      .upload(path, file, { upsert: true, cacheControl: '3600' })

    if (uploadError) {
      setErro('Erro no upload: ' + uploadError.message)
      setLoading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatares')
      .getPublicUrl(path)

    const novaUrl = `${urlData.publicUrl}?v=${Date.now()}`

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
        <div
          className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center border-4 border-white"
          style={{
            backgroundColor: 'var(--color-primary-soft)',
            boxShadow: '0 8px 24px rgba(13, 110, 253, 0.15)',
          }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--color-primary)' }}
            >
              {nome.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading || aRemover}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center disabled:cursor-not-allowed"
        >
          <span
            className="text-xs font-semibold"
            style={{ color: '#FFFFFF' }}
          >
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
          className="text-[13px] font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
          style={{ color: 'var(--color-primary)' }}
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
              className="text-[13px] font-medium text-red-600 hover:text-red-700 transition-colors duration-150 disabled:opacity-60"
            >
              {aRemover ? 'A remover...' : 'Remover foto'}
            </button>
          </>
        )}
      </div>

      {erro && (
        <p className="mt-2 text-[12px] text-red-600 text-center max-w-[240px]">
          {erro}
        </p>
      )}

      <p className="mt-2 text-[11px] text-[#94A3B8]">
        PNG ou JPG, máx. 2MB
      </p>
    </div>
  )
}