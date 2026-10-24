import { ArrowUpRight, Laptop } from "lucide-react"
import { Collapsible } from "@/components/opportunities/collapsible"

/** Vacante de TI abierta que se muestra dentro de la tarjeta de su empresa o institución. */
export type ITJobLink = { id: string; title: string; city: string | null; url: string }

const PREVIEW = 5

// "INGENIERO DE DATOS - QUITO" -> "Ingeniero de datos - Quito"
export const tidyTitle = (text: string) => text === text.toUpperCase() ? text.toLowerCase().replace(/(^|[\s(-])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase()).replace(/\bb(Ti|It|Ia|Ux|Qa|Smo|Bi|Coe|Uio|Gye)\b/g, (word) => word.toUpperCase()).replace(/\b(De|Del|La|Las|Los|Y|En|Con)\b/g, (word) => word.toLowerCase()) : text

function JobLink({ job }: { job: ITJobLink }) {
  // La ciudad solo si el título no la nombra ya ("Ingeniero de datos - Quito")
  const city = job.city && !job.title.toLowerCase().includes(job.city.toLowerCase()) ? tidyTitle(job.city) : null
  return <li><a href={job.url} target="_blank" rel="noreferrer" className="flex items-start gap-1.5 text-sm font-semibold text-sky-800 hover:underline dark:text-sky-300"><Laptop className="mt-0.5 size-3.5 shrink-0" /><span>{tidyTitle(job.title)}{city && <span className="font-normal text-muted-foreground"> · {city}</span>}</span><ArrowUpRight className="mt-0.5 size-3.5 shrink-0" /></a></li>
}

/** Lista de vacantes de TI abiertas con enlace directo; con muchas, las primeras a la vista y el resto plegado. */
export function ITJobLinks({ jobs }: { jobs: ITJobLink[] }) {
  if (jobs.length === 0) return null
  const rest = jobs.slice(PREVIEW)
  return <div className="mt-1 rounded-lg bg-sky-50/70 p-2 dark:bg-sky-950/30">
    <ul className="flex flex-col gap-1">{jobs.slice(0, PREVIEW).map((job) => <JobLink key={job.id} job={job} />)}</ul>
    {rest.length > 0 && <Collapsible className="mt-2 bg-transparent" summary={`Ver las otras ${rest.length} de TI`}>
      <ul className="flex flex-col gap-1">{rest.map((job) => <JobLink key={job.id} job={job} />)}</ul>
    </Collapsible>}
  </div>
}
