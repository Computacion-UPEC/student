// Botón "Actualizar ofertas" de la página de Oportunidades.
//
// GET  → estado de la última recolección (workflow "Recolectar convocatorias" en GitHub Actions) y cuándo se puede
//        volver a pedir una.
// POST → pide una recolección nueva (workflow_dispatch) si se cumplen las reglas:
//          - no hay una recolección en curso;
//          - pasaron al menos 12 horas desde la última pedida a mano (cualquiera puede pulsar el botón);
//          - pasaron al menos 2 horas desde la última recolección de cualquier tipo (la automática corre cada 12 h).
// Los recolectores corren en los servidores de GitHub; al terminar hacen commit de los datos y Vercel vuelve a desplegar.
// Requiere la variable de entorno GITHUB_ACTIONS_TOKEN (token con permiso "Actions: read and write" sobre el repo).

import { NextResponse } from "next/server"

const REPO = "Computacion-UPEC/student"
const WORKFLOW = "petroecuador.yml"
const HORAS_ENTRE_PEDIDOS = 12
const HORAS_DESDE_CUALQUIERA = 2
const HORA = 3_600_000

type Run = { event: string; status: string; conclusion: string | null; created_at: string; updated_at: string; html_url: string }

function headers(): HeadersInit {
  const token = process.env.GITHUB_ACTIONS_TOKEN
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "computacion-upec-oportunidades",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function ultimasCorridas(): Promise<Run[]> {
  const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=30`,
    { headers: headers(), cache: "no-store" })
  if (!r.ok) throw new Error(`GitHub respondió ${r.status}`)
  return (await r.json()).workflow_runs as Run[]
}

function estado(runs: Run[], ahora = Date.now()) {
  const enCurso = runs.find((run) => run.status !== "completed")
  const ultima = runs.find((run) => run.status === "completed")
  const ultimaManual = runs.find((run) => run.event === "workflow_dispatch")
  const limites = [
    ultimaManual ? Date.parse(ultimaManual.created_at) + HORAS_ENTRE_PEDIDOS * HORA : 0,
    runs[0] ? Date.parse(runs[0].updated_at) + HORAS_DESDE_CUALQUIERA * HORA : 0,
  ]
  const disponibleDesde = Math.max(...limites)
  return {
    enCurso: Boolean(enCurso),
    ultima: ultima && { fin: ultima.updated_at, tipo: ultima.event === "schedule" ? "automática" : "manual", resultado: ultima.conclusion, url: ultima.html_url },
    disponibleDesde: disponibleDesde > ahora ? new Date(disponibleDesde).toISOString() : null,
    configurado: Boolean(process.env.GITHUB_ACTIONS_TOKEN),
    reglas: { horasEntrePedidos: HORAS_ENTRE_PEDIDOS, horasDesdeCualquiera: HORAS_DESDE_CUALQUIERA },
  }
}

export async function GET() {
  try {
    return NextResponse.json(estado(await ultimasCorridas()))
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 })
  }
}

export async function POST(request: Request) {
  // Solo desde la propia página: evita que otro sitio dispare recolecciones
  const origen = request.headers.get("origin")
  if (origen && new URL(origen).host !== new URL(request.url).host) {
    return NextResponse.json({ ok: false, mensaje: "Origen no permitido." }, { status: 403 })
  }
  if (!process.env.GITHUB_ACTIONS_TOKEN) {
    return NextResponse.json({ ok: false, mensaje: "La actualización manual aún no está configurada en el sitio." }, { status: 503 })
  }
  try {
    const actual = estado(await ultimasCorridas())
    if (actual.enCurso) return NextResponse.json({ ok: false, mensaje: "Ya se están actualizando las ofertas.", ...actual }, { status: 409 })
    if (actual.disponibleDesde) {
      return NextResponse.json({ ok: false, mensaje: "Las ofertas se actualizaron hace poco: vuelve a intentarlo más tarde.", ...actual }, { status: 429 })
    }
    const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      { method: "POST", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify({ ref: "main" }), cache: "no-store" })
    if (r.status !== 204) throw new Error(`GitHub respondió ${r.status}`)
    return NextResponse.json({ ok: true, mensaje: "Actualización iniciada: las ofertas nuevas aparecen en unos 10 a 15 minutos." }, { status: 202 })
  } catch (error) {
    return NextResponse.json({ ok: false, mensaje: `No se pudo iniciar la actualización (${(error as Error).message}).` }, { status: 502 })
  }
}
