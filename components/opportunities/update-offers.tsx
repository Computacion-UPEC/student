"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"

/** Estado que devuelve /api/ofertas/actualizar. */
type Estado = {
  enCurso: boolean
  ultima?: { fin: string; tipo: "automática" | "manual"; resultado: string | null; url: string }
  error?: string
}

const formatoFecha = (iso: string) => new Date(iso).toLocaleString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

/** Cuándo se actualizaron las ofertas por última vez (solo lectura: las recolecciones no se inician desde el sitio). */
export function UpdateOffers() {
  const [estado, setEstado] = useState<Estado | null>(null)
  useEffect(() => {
    fetch("/api/ofertas/actualizar").then((r) => r.json()).then(setEstado).catch(() => setEstado(null))
  }, [])

  if (!estado || estado.error) return null
  const u = estado.ultima
  const Icono = estado.enCurso ? Loader2 : u?.resultado === "success" ? CheckCircle2 : u ? XCircle : Clock

  return <div className="mb-8 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icono className={`size-5 ${estado.enCurso ? "animate-spin" : ""}`} /></span>
    <div>
      <p className="font-heading text-base font-bold text-foreground">{estado.enCurso ? "Actualizando ofertas…" : "Ofertas de empleo"}</p>
      <p className="text-sm text-muted-foreground">
        {estado.enCurso
          ? "Los recolectores están revisando los portales; las ofertas nuevas aparecen en unos minutos."
          : u ? <>Última actualización: <a href={u.url} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:underline">{formatoFecha(u.fin)}</a>{u.resultado === "success" ? "" : " (con errores en alguna fuente)"}. Se actualizan solas a las 08:00 y 18:00.</>
            : "Se actualizan solas a las 08:00 y 18:00."}
      </p>
    </div>
  </div>
}
