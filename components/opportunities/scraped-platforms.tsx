import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Collapsible } from "@/components/opportunities/collapsible"
import { platformStatus, scrapedPlatforms, type ScrapeMethod } from "@/lib/scraped-platforms"

const methodLabel: Record<ScrapeMethod, string> = { automática: "Automática", local: "Computador en Ecuador", manual: "Manual" }

/** "2026-11-02" -> "2 nov 2026" (el día ya está en hora de Ecuador: se formatea sin zona horaria). */
const formatDay = (day: string) => new Date(`${day}T12:00:00Z`).toLocaleDateString("es-EC", { timeZone: "UTC", day: "numeric", month: "short", year: "numeric" })

/** Tabla de todas las plataformas que se revisan y el día de su última revisión (lib/data/scrape-status.json). */
export function ScrapedPlatforms() {
  const rows = scrapedPlatforms.map((platform) => ({ ...platform, status: platformStatus[platform.key] }))
  return <Collapsible className="mb-2" summary={`Plataformas que revisamos (${rows.length}) y su última revisión`}>
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13px]">
        <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
          <tr><th className="py-2 pr-3 font-semibold">Plataforma</th><th className="py-2 pr-3 font-semibold">Qué recogemos</th><th className="py-2 pr-3 font-semibold">Cómo</th><th className="py-2 font-semibold">Última revisión</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(({ key, name, url, collects, method, schedule, status }) => <tr key={key} className="align-top">
            <td className="py-2 pr-3">{url ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">{name}<ArrowUpRight className="size-3.5 shrink-0" /></a> : <span className="font-medium text-foreground">{name}</span>}</td>
            <td className="py-2 pr-3 text-muted-foreground">{collects}</td>
            <td className="py-2 pr-3"><Badge variant="outline">{methodLabel[method]}</Badge><p className="mt-1 text-xs text-muted-foreground">{schedule}</p></td>
            <td className="py-2">
              {status
                ? <>
                  <p className="font-medium text-foreground">{formatDay(status.lastRun)}</p>
                  {!status.ok && <p className="text-xs text-destructive">Con fallas{status.lastSuccess ? `; última sin errores: ${formatDay(status.lastSuccess)}` : ""}</p>}
                </>
                : <span className="text-muted-foreground">Sin registro</span>}
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </Collapsible>
}
