import type { Metadata } from "next"
import { ArrowLeft, Handshake, UsersRound } from "lucide-react"
import Link from "next/link"
import { CommunitiesSection } from "@/components/communities-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Comunidades | COMC & IEEE Student Branch UPEC",
  description: "Comunidades tecnológicas para aprender, colaborar y crecer como estudiante de Computación UPEC.",
}

export default function CommunitiesPage() {
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
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg"><UsersRound data-icon="inline-start" /></div>
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Red para crecer</p>
                <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">Comunidades</h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-primary-foreground/75">Encuentra tu comunidad, aprende con otros developers y abre puertas para colaborar, liderar o convertirte en embajador.</p>
              </div>
            </div>
          </div>
        </section>
        <CommunitiesSection />
      </main>
      <SiteFooter />
    </div>
  )
}
