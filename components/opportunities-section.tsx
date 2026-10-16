"use client"

import { useEffect, useState } from "react"
import { BriefcaseBusiness, GraduationCap, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgramsList } from "@/components/opportunities/programs-list"
import { EmploymentTab } from "@/components/opportunities/employment-tab"
import { StagePicker } from "@/components/opportunities/stage-picker"
import { programs } from "@/lib/scholarships-data"
import { isStage, type Stage } from "@/lib/student-stages"

const tabs = ["empleo", "becas"] as const
type Tab = (typeof tabs)[number]
const STAGE_KEY = "oportunidades-etapa"

export function OpportunitiesSection() {
  const [tab, setTab] = useState<Tab>("empleo")
  const [stage, setStage] = useState<Stage | null>(null)

  // La pestaña vive en el hash (#empleo / #becas) para poder compartir el enlace
  useEffect(() => {
    const fromHash = () => { const hash = window.location.hash.slice(1); if ((tabs as readonly string[]).includes(hash)) setTab(hash as Tab) }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [])

  // La etapa viene del enlace (?etapa=mitad) o de la última elegida en este dispositivo
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("etapa")
    let saved: string | null = null
    try { saved = localStorage.getItem(STAGE_KEY) } catch { /* almacenamiento no disponible */ }
    const initial = isStage(fromUrl) ? fromUrl : isStage(saved) ? saved : null
    if (initial) setStage(initial)
  }, [])

  const changeTab = (value: string) => {
    setTab(value as Tab)
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${value}`)
  }

  const changeStage = (value: Stage | null) => {
    setStage(value)
    try { if (value) localStorage.setItem(STAGE_KEY, value); else localStorage.removeItem(STAGE_KEY) } catch { /* almacenamiento no disponible */ }
    const params = new URLSearchParams(window.location.search)
    if (value) params.set("etapa", value); else params.delete("etapa")
    // Graduados buscan sobre todo empleo; el resto, internships y becas
    const nextTab: Tab = value === "graduado" ? "empleo" : value ? "becas" : tab
    setTab(nextTab)
    const query = params.toString()
    history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}#${nextTab}`)
  }

  const matches = stage ? programs.filter((program) => program.stages.includes(stage)).length : null

  return <section id="oportunidades" className="scroll-mt-20 border-t border-border bg-muted/30 py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground">
        <Sparkles className="shrink-0 text-secondary" />
        <p className="text-sm leading-relaxed text-primary-foreground/85"><span className="font-semibold text-primary-foreground">Especialízate con evidencia.</span> Revisa ofertas reales para saber qué piden y cuánto pagan, y aprovecha internships y becas para ganar experiencia.</p>
      </div>

      <StagePicker stage={stage} onChange={changeStage} matches={matches} />

      <Tabs value={tab} onValueChange={changeTab}>
        <TabsList className="mb-8 h-auto w-full justify-start gap-1 rounded-xl p-1 sm:w-auto">
          <TabsTrigger value="empleo" className="flex-1 gap-2 rounded-lg px-4 py-2 text-sm sm:flex-none"><BriefcaseBusiness className="size-4" /> Empleo</TabsTrigger>
          <TabsTrigger value="becas" className="flex-1 gap-2 rounded-lg px-4 py-2 text-sm sm:flex-none"><GraduationCap className="size-4" /> Internships / Becas{matches != null && <span className="rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">{matches}</span>}</TabsTrigger>
        </TabsList>
        <TabsContent value="empleo" className="mt-0"><EmploymentTab stage={stage} /></TabsContent>
        <TabsContent value="becas" className="mt-0"><ProgramsList stage={stage} onClearStage={() => changeStage(null)} /></TabsContent>
      </Tabs>
    </div>
  </section>
}
