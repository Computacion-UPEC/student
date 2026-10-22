// Estado de la recolección de ofertas para la página de Oportunidades: cuándo corrió por última vez el workflow
// "Recolectar convocatorias" de GitHub Actions y si está corriendo ahora.
//
// Solo lectura: el sitio no inicia recolecciones. Corren solas dos veces al día, y a pedido solo desde el panel
// local del administrador (encuentraempleo-scraper, con su propia sesión de GitHub).
// El repositorio es público, así que no hace falta token; la respuesta se guarda 5 minutos para no gastar el límite
// de la API de GitHub.

import { NextResponse } from "next/server"

const REPO = "Computacion-UPEC/student"
const WORKFLOW = "petroecuador.yml"

type Run = { event: string; status: string; conclusion: string | null; updated_at: string; html_url: string }

export async function GET() {
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=10`, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "computacion-upec-oportunidades" },
      next: { revalidate: 300 },
    })
    if (!r.ok) throw new Error(`GitHub respondió ${r.status}`)
    const runs = (await r.json()).workflow_runs as Run[]
    const ultima = runs.find((run) => run.status === "completed")
    return NextResponse.json({
      enCurso: runs.some((run) => run.status !== "completed"),
      ultima: ultima && { fin: ultima.updated_at, tipo: ultima.event === "schedule" ? "automática" : "manual", resultado: ultima.conclusion, url: ultima.html_url },
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 })
  }
}
