"use client"

import { useEffect, useState } from "react"
import { BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CelecJobs } from "@/components/opportunities/celec-jobs"
import { ProgramsList } from "@/components/opportunities/programs-list"
import { PublicRoutes } from "@/components/opportunities/public-routes"

const tabs = ["empleo", "becas"] as const
type Tab = (typeof tabs)[number]

export function OpportunitiesSection() {
  const [tab, setTab] = useState<Tab>("empleo")

  // La pestaña vive en el hash (#empleo / #becas) para poder compartir el enlace
  useEffect(() => {
    const fromHash = () => { const hash = window.location.hash.slice(1); if ((tabs as readonly string[]).includes(hash)) setTab(hash as Tab) }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [])

  const changeTab = (value: string) => {
    setTab(value as Tab)
    history.replaceState(null, "", `#${value}`)
  }

  return <section id="oportunidades" className="scroll-mt-20 border-t border-border bg-muted/30 py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground">
        <Sparkles className="shrink-0 text-secondary" />
        <p className="text-sm leading-relaxed text-primary-foreground/85"><span className="font-semibold text-primary-foreground">Especialízate con evidencia.</span> Revisa ofertas reales para saber qué piden y cuánto pagan, y aprovecha internships y becas para ganar experiencia.</p>
      </div>

      <Tabs value={tab} onValueChange={changeTab}>
        <TabsList className="mb-8 h-auto w-full justify-start gap-1 rounded-xl p-1 sm:w-auto">
          <TabsTrigger value="empleo" className="flex-1 gap-2 rounded-lg px-4 py-2 text-sm sm:flex-none"><BriefcaseBusiness className="size-4" /> Empleo</TabsTrigger>
          <TabsTrigger value="becas" className="flex-1 gap-2 rounded-lg px-4 py-2 text-sm sm:flex-none"><GraduationCap className="size-4" /> Internships / Becas</TabsTrigger>
        </TabsList>
        <TabsContent value="empleo" className="mt-0"><PublicRoutes /><CelecJobs /></TabsContent>
        <TabsContent value="becas" className="mt-0"><ProgramsList /></TabsContent>
      </Tabs>
    </div>
  </section>
}
