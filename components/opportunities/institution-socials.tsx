import { ArrowUpRight, Facebook, Globe, Instagram, Lightbulb, Linkedin, Music2, Twitter, Users, Youtube } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { institutionSocials, type SocialNetwork } from "@/lib/institution-socials"
import { Collapsible } from "@/components/opportunities/collapsible"

const networks: { id: SocialNetwork; icon: typeof Globe }[] = [
  { id: "LinkedIn", icon: Linkedin },
  { id: "X", icon: Twitter },
  { id: "Facebook", icon: Facebook },
  { id: "Instagram", icon: Instagram },
  { id: "YouTube", icon: Youtube },
  { id: "TikTok", icon: Music2 },
]

export function InstitutionSocials() {
  return <section aria-labelledby="institution-socials" className="mb-6">
    {/* No son ofertas: plegado al inicio */}
    <Collapsible summary={<span id="institution-socials">Sigue a las instituciones<span className="font-normal"> · cuentas oficiales de {institutionSocials.length} instituciones</span></span>}>
    <p className="mb-3 max-w-2xl text-xs text-muted-foreground">Sus cuentas oficiales anuncian convocatorias, proyectos y cambios de autoridades antes que nadie. En LinkedIn, la pestaña &ldquo;Personas&rdquo; de cada empresa te muestra a su equipo y a sus directivos. Facebook, Instagram y LinkedIn pueden pedirte iniciar sesión para ver la página completa.</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{institutionSocials.map((institution) => <div key={institution.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <a href={institution.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-heading text-base font-bold text-foreground hover:text-primary">{institution.name}<ArrowUpRight className="size-4 text-muted-foreground" /></a>
        <Badge variant="secondary" className="text-[11px]">{institution.sector}</Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">{networks.filter((network) => institution.accounts[network.id]).map(({ id, icon: Icon }) => <a key={id} href={institution.accounts[id]} target="_blank" rel="noreferrer" aria-label={`${institution.name} en ${id}`} title={id} className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"><Icon className="size-4" /></a>)}</div>
      {institution.authorities && <a href={institution.authorities} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"><Users className="size-3.5" />Autoridades<ArrowUpRight className="size-3.5" /></a>}
    </div>)}</div>
    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground"><Lightbulb className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span>Sigue a la institución y a sus áreas de tecnología antes de postular: entenderás sus proyectos y tendrás de qué hablar en la entrevista.</span></p>
    </Collapsible>
  </section>
}
