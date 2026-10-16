import { ArrowRight, BookOpen, Briefcase, Check, GraduationCap, Rocket, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { stages, stageById, type Stage } from "@/lib/student-stages"

const stageIcons = { inicio: BookOpen, mitad: Rocket, final: GraduationCap, graduado: Briefcase }

export function StagePicker({ stage, onChange, matches }: { stage: Stage | null; onChange: (stage: Stage | null) => void; matches: number | null }) {
  const current = stage ? stageById[stage] : null

  return <div className="mb-8 rounded-2xl border border-border bg-card p-4 md:p-6">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div><h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">¿En qué etapa de la carrera estás?</h2><p className="mt-1 text-sm text-muted-foreground">Elige una y te mostramos primero lo que puedes aprovechar ahora.</p></div>
      {stage && <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}><X data-icon="inline-start" /> Ver todo</Button>}
    </div>

    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3" role="radiogroup" aria-label="Etapa de la carrera">
      {stages.map((item) => {
        const Icon = stageIcons[item.id]
        const selected = stage === item.id
        return <button key={item.id} type="button" role="radio" aria-checked={selected} onClick={() => onChange(selected ? null : item.id)} className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all md:p-4 ${selected ? "border-primary bg-primary text-primary-foreground shadow-md" : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"}`}>
          <span className={`flex size-9 items-center justify-center rounded-lg ${selected ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}`}><Icon className="size-5" /></span>
          <span className="font-heading text-sm font-bold leading-tight md:text-base">{item.label}</span>
          <span className={`text-xs ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{item.range}</span>
        </button>
      })}
    </div>

    {current && <div className="mt-5 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
      <p className="font-semibold text-foreground">{current.goal}{matches != null && <span className="font-normal text-muted-foreground"> · {matches} internships y becas para ti</span>}</p>
      <ol className="mt-3 grid gap-2 md:grid-cols-3">
        {current.plan.map((step, index) => <li key={step.text} className="flex gap-2 rounded-lg bg-background p-3 text-sm text-foreground">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{index + 1}</span>
          <span className="flex flex-col gap-1">{step.text}{step.href && <a href={step.href} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">{step.href === "/comunidades" ? "Ir a Comunidades" : step.href === "#empleo" ? "Ver empleo" : "Ver internships y becas"} <ArrowRight className="size-3" /></a>}</span>
        </li>)}
      </ol>
    </div>}
  </div>
}

/** Aviso en la pestaña Empleo para quienes todavía no tienen título. */
export function EmploymentStageNotice({ stage }: { stage: Stage | null }) {
  if (stage === "graduado") return <div className="mb-8 flex gap-2 rounded-2xl border border-sky-600/30 bg-sky-50/70 p-4 text-sm text-foreground dark:bg-sky-950/30"><Check className="mt-0.5 size-4 shrink-0 text-sky-700 dark:text-sky-400" /><span>Ninguna oferta de CELEC acepta postulantes sin experiencia: la mínima es 1 año. Usa el filtro <span className="font-semibold">Experiencia que piden</span> y <span className="font-semibold">Solo TI</span> para ver a cuáles puedes postular, y revisa las rutas del sector público.</span></div>
  if (stage !== "inicio" && stage !== "mitad" && stage !== "final") return null
  const finalYear = stage === "final"
  return <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-sky-600/30 bg-sky-50/70 p-4 md:flex-row md:items-center md:justify-between dark:bg-sky-950/30">
    <p className="flex gap-2 text-sm text-foreground"><Check className="mt-0.5 size-4 shrink-0 text-sky-700 dark:text-sky-400" /><span>{finalYear ? "Casi todas estas convocatorias piden título y experiencia. Úsalas para ver qué se pide y orientar tu tesis y tus prácticas." : "Estas convocatorias piden título y experiencia. Por ahora te conviene más un internship o una beca; vuelve aquí cuando estés por graduarte."}</span></p>
    <Button asChild size="sm" className="shrink-0"><a href="#becas">Ver internships y becas para ti <ArrowRight data-icon="inline-end" /></a></Button>
  </div>
}
