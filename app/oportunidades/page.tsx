import type { Metadata } from "next"
import { ArrowLeft, BriefcaseBusiness } from "lucide-react"
import Link from "next/link"
import { OpportunitiesSection } from "@/components/opportunities-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Oportunidades | COMC & IEEE Student Branch UPEC",
  description: "Histórico de ofertas de empleo y habilidades buscadas para estudiantes de Computación UPEC.",
}

export default function OpportunitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-primary px-6 py-14 text-primary-foreground md:py-20">
          <div className="mx-auto max-w-7xl">
            <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/75 transition-colors hover:text-secondary">
              <ArrowLeft data-icon="inline-start" /> Volver al inicio
            </Link>
            <div className="flex max-w-3xl flex-col gap-5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg">
                <BriefcaseBusiness data-icon="inline-start" />
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Mercado laboral</p>
                <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">Oportunidades</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/75">
                  Un espacio independiente para consultar ofertas, reconocer tendencias del mercado y decidir en qué especializarte.
                </p>
              </div>
            </div>
          </div>
        </section>
        <OpportunitiesSection />
      </main>
      <SiteFooter />
    </div>
  )
}


  
