import Link from 'next/link'
import Hero from '@/components/public/Hero'
import NoticiaCard from '@/components/public/NoticiaCard'
import SobreSection from '@/components/public/SobreSection'
import CultosSection from '@/components/public/CultosSection'
import ContactosSection from '@/components/public/ContactosSection'
import Reveal from '@/components/public/Reveal'
import { createClient } from '@/lib/supabase/server'
import type { Noticia } from '@/types'

export default async function Home() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('data_publicacao', { ascending: false })
    .limit(3)

  return (
    <>
      {/* #inicio */}
      <div id="inicio" className="scroll-mt-20">
        <Hero />
      </div>

      {/* #noticias */}
      <section id="noticias" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-semibold tracking-wider uppercase text-blue-700">
                  Notícias
                </span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  Últimas Publicações
                </h2>
                <p className="mt-4 text-base text-gray-600 leading-relaxed">
                  Fica a par das novidades, eventos e avisos da nossa
                  paróquia.
                </p>
              </div>

              <Link
                href="/noticias"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150 whitespace-nowrap"
              >
                Ver todas
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </Reveal>

          {!noticias || noticias.length === 0 ? (
            <Reveal>
              <div className="bg-gray-50 rounded-xl border border-gray-100 px-6 py-16 text-center">
                <p className="text-sm text-gray-500">
                  Ainda não há notícias publicadas.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticias.map((noticia, i) => (
                <Reveal key={noticia.id} delay={i * 100}>
                  <NoticiaCard noticia={noticia as Noticia} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-8 md:hidden">
            <Link
              href="/noticias"
              className="block w-full text-center bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-5 py-3 rounded-lg transition-colors duration-200"
            >
              Ver todas as notícias
            </Link>
          </div>
        </div>
      </section>

      {/* #sobre */}
      <SobreSection />

      {/* #cultos */}
      <CultosSection />

      {/* #contactos */}
      <ContactosSection />
    </>
  )
}