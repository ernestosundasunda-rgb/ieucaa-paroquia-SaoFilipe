import Link from 'next/link'
import Hero from '@/components/public/Hero'
import StatsSection from '@/components/public/StatsSection'
import OQueFazemos from '@/components/public/OQueFazemos'
import NoticiaCard from '@/components/public/NoticiaCard'
import SobreSection from '@/components/public/SobreSection'
import CultosSection from '@/components/public/CultosSection'
import ContactosSection from '@/components/public/ContactosSection'
import Reveal from '@/components/public/Reveal'
import { createClient } from '@/lib/supabase/server'
import type { Noticia } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: noticias },
    { count: totalMembros },
    { count: totalNoticias },
  ] = await Promise.all([
    supabase
      .from('noticias')
      .select('*')
      .order('data_publicacao', { ascending: false })
      .limit(3),
    supabase.from('membros').select('*', { count: 'exact', head: true }),
    supabase.from('noticias').select('*', { count: 'exact', head: true }),
  ])

  return (
    <>
      <div id="inicio" className="scroll-mt-20">
        <Hero />
      </div>

      <StatsSection
        totalMembros={totalMembros ?? 0}
        totalNoticias={totalNoticias ?? 0}
      />

      <OQueFazemos />

      {/* NOTÍCIAS — fundo cinza */}
      <section id="noticias" className="section bg-[#F8FAFC] scroll-mt-20">
        <div className="container">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
              <div className="lg:col-span-4">
                <span className="section-label">
                  <span className="w-8 h-px bg-[#0D6EFD]" />
                  Notícias
                </span>
              </div>

              <div className="lg:col-span-8 flex items-end justify-between gap-6">
                <h2 className="section-title">Últimas publicações</h2>

                <Link
                  href="/noticias"
                  className="hidden md:inline-flex btn btn-ghost whitespace-nowrap"
                >
                  Ver todas
                </Link>
              </div>
            </div>
          </Reveal>

          {!noticias || noticias.length === 0 ? (
            <Reveal>
              <div className="card-static p-12 text-center">
                <p className="text-[14px] text-[#64748B]">
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
            <Link href="/noticias" className="btn btn-primary w-full">
              Ver todas as notícias
            </Link>
          </div>
        </div>
      </section>

      <SobreSection />
      <CultosSection />
      <ContactosSection />
    </>
  )
}