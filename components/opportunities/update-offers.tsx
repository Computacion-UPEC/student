"use client"

import { useCallback, useEffect, useState } from "react"
import { CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Estado que devuelve /api/ofertas/actualizar. */
type Estado = {
  enCurso: boolean
  ultima?: { fin: string; tipo: "automática" | "manual"; resultado: string | null; url: string }
  disponibleDesde: string | null
  configurado: boolean
  reglas: { horasEntrePedidos: number; horasDesdeCualquiera: number }
  error?: string
}

const formatoFecha = (iso: string) => new Date(iso).toLocaleString("es-EC", { timeZone: "America/Guayaquil", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })

function faltan(iso: string, ahora: number) {
  const minutos = Math.max(1, Math.ceil((Date.parse(iso) - ahora) / 60_000))
  return minutos < 60 ? `${minutos} min` : `${Math.floor(minutos / 60)} h ${minutos % 60} min`
}

/** Botón para pedir una recolección de ofertas en GitHub Actions, con la última actualización y sus restricciones. */
export function UpdateOffers() {
  const [estado, setEstado] = useState<Estado | null>(null)
  const [mensaje, setMensaje] = useState<{ texto: string; ok: boolean } | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [ahora, setAhora] = useState(() => Date.now())

  const cargar = useCallback(async () => {
    try {
      const r = await fetch("/api/ofertas/actualizar", { cache: "no-store" })
      setEstado(await r.json())
    } catch {
      setEstado(null)
    }
    setAhora(Date.now())
  }, [])

  useEffect(() => { cargar() }, [cargar])
  // Mientras se actualiza, se revisa cada 30 s; si no, cada 5 min (para la cuenta regresiva)
  useEffect(() => {
    const t = setInterval(cargar, estado?.enCurso ? 30_000 : 300_000)
    return () => clearInterval(t)
  }, [cargar, estado?.enCurso])

  async function actualizar() {
    setEnviando(true)
    try {
      const r = await fetch("/api/ofertas/actualizar", { method: "POST" })
      const d = await r.json()
      setMensaje({ texto: d.mensaje, ok: Boolean(d.ok) })
    } catch {
      setMensaje({ texto: "No se pudo contactar al servidor.", ok: false })
    }
    setEnviando(false)
    setTimeout(cargar, 5_000) // GitHub tarda unos segundos en registrar la corrida
  }

  if (!estado || estado.error) return null

  const u = estado.ultima
  const bloqueado = estado.enCurso || Boolean(estado.disponibleDesde) || !estado.configurado
  const Icono = estado.enCurso ? Loader2 : u?.resultado === "success" ? CheckCircle2 : u ? XCircle : Clock

  return <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icono className={`size-5 ${estado.enCurso ? "animate-spin" : ""}`} /></span>
      <div>
        <p className="font-heading text-base font-bold text-foreground">{estado.enCurso ? "Actualizando ofertas…" : "Ofertas de empleo"}</p>
        <p className="text-sm text-muted-foreground">
          {estado.enCurso
            ? "Los recolectores están revisando los portales; las ofertas nuevas aparecen en unos minutos (recarga la página)."
            : u ? <>Última actualización: <a href={u.url} target="_blank" rel="noreferrer" className="font-medium text-foreground hover:underline">{formatoFecha(u.fin)}</a> ({u.tipo}{u.resultado === "success" ? "" : ", con errores"}). Se actualizan solas a las 08:00 y 18:00.</>
              : "Se actualizan solas a las 08:00 y 18:00."}
        </p>
        {mensaje && <p className={`mt-1 text-sm font-medium ${mensaje.ok ? "text-emerald-700 dark:text-emerald-400" : "text-destructive"}`}>{mensaje.texto}</p>}
      </div>
    </div>
    <div className="flex flex-col items-start gap-1 md:items-end">
      <Button type="button" onClick={actualizar} disabled={bloqueado || enviando}>
        <RefreshCw data-icon="inline-start" className={enviando ? "animate-spin" : ""} />Actualizar ofertas
      </Button>
      <span className="text-xs text-muted-foreground">
        {!estado.configurado ? "Actualización manual no disponible todavía."
          : estado.enCurso ? "Espera a que termine."
            : estado.disponibleDesde ? `Disponible en ${faltan(estado.disponibleDesde, ahora)}.`
              : `Máximo una vez cada ${estado.reglas.horasEntrePedidos} h.`}
      </span>
    </div>
  </div>
}
