"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, ExternalLink, Handshake, Search, Sparkles, UsersRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { communities } from "@/lib/communities-data"

// Embajadores de la rama IEEE UPEC (tarjetas oficiales de IEEEXtreme)
const branchAmbassadors = [
  { name: "John Cortés Pozo", event: "IEEEXtreme 19.0", src: "/images/ambassadors/john-cortes-ieeextreme-19.jpg" },
  { name: "Luis Valverde", event: "IEEEXtreme 20.0 · Sección Ecuador", src: "/images/ambassadors/luis-valverde-ieeextreme-20.jpg" },
]

// Fotos con licencia de Unsplash (uso libre); se cita al autor en cada una
const ambassadorPhotos = [
  { src: "https://images.unsplash.com/photo-1704652329528-354ac651ed8f", alt: "Ingeniero trabajando en su portátil dentro de un avión", caption: "Viaja a eventos y programas", credit: { name: "Chase Chappell", url: "https://unsplash.com/photos/UKmDt6I1zyo" } },
  { src: "https://images.unsplash.com/photo-1762968286778-60e65336d5ca", alt: "Speaker presentando sobre inteligencia artificial en un escenario", caption: "Comparte lo que sabes", credit: { name: "Carlos Gil", url: "https://unsplash.com/photos/seVjuvIinV4" } },
  { src: "https://images.unsplash.com/photo-1768793096346-6d84e93e4195", alt: "Desarrollador trabajando con su portátil junto a la ventana de un aeropuerto al amanecer", caption: "Trabaja desde cualquier lugar", credit: { name: "Daniel Gomez", url: "https://unsplash.com/photos/iNK8lpCBlfg" } },
]

export function CommunitiesSection() {
  const [query, setQuery] = useState("")
  const visible = useMemo(() => communities.filter((community) => `${community.name} ${community.category} ${community.description} ${community.opportunities}`.toLowerCase().includes(query.toLowerCase())), [query])

  return <section className="border-t border-border bg-muted/30 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-10 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground"><Sparkles className="shrink-0 text-secondary" /><p className="text-sm leading-relaxed text-primary-foreground/85"><span className="font-semibold text-primary-foreground">Tu siguiente conexión puede cambiar tu carrera.</span> Únete, participa en eventos y convierte tus proyectos en oportunidades.</p></div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between md:p-5"><div><h2 className="font-heading text-2xl font-bold md:text-3xl">Explora la red</h2><p className="mt-1 text-sm text-muted-foreground">{communities.length} comunidades para aprender y colaborar.</p></div><label className="relative block w-full md:max-w-sm"><span className="sr-only">Buscar comunidades</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cloud, open source, IA..." className="pl-10" /></label></div>
      <Card className="mb-8 overflow-hidden border-secondary/40 bg-secondary/10 py-0"><CardContent className="grid gap-6 p-5 md:p-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><UsersRound aria-hidden="true" /></div><div><h2 className="font-heading text-xl font-bold text-foreground">¿Qué significa ser embajador?</h2><p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Un embajador representa una tecnología o comunidad en su universidad y ciudad. Comparte conocimiento, organiza talleres, conecta a otros estudiantes con oportunidades y recibe acompañamiento de la comunidad oficial.</p><p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">¿Por qué hacerlo?</span> Porque fortalece tu liderazgo, comunicación y portafolio; te conecta con mentores y otros developers, y puede abrirte puertas a eventos, certificaciones, programas estudiantiles y colaboraciones.</p></div></div>
        <div className="grid h-80 grid-cols-2 grid-rows-2 gap-3 sm:h-96">
          {ambassadorPhotos.map((photo, index) => <figure key={photo.src} className={`group relative overflow-hidden rounded-2xl shadow-md ${index === 0 ? "row-span-2" : ""}`}>
            <img src={`${photo.src}?auto=format&fit=crop&w=${index === 0 ? 700 : 800}&q=75`} alt={photo.alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6 text-[11px] text-white/90">{photo.caption} · <a href={photo.credit.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">Foto: {photo.credit.name} / Unsplash</a></figcaption>
          </figure>)}
        </div>
      </CardContent></Card>
      <div className="mb-8">
        <div className="mb-4"><h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">Embajadores de nuestra rama</h2><p className="mt-1 text-sm text-muted-foreground">Estudiantes de Computación UPEC que representan a la IEEE Student Branch en competencias internacionales.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-3xl">{branchAmbassadors.map((ambassador) => <figure key={ambassador.src} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <img src={ambassador.src} alt={`${ambassador.name}, Student Branch Ambassador de la Universidad Politécnica Estatal del Carchi en ${ambassador.event}`} loading="lazy" className="aspect-square w-full object-cover object-top" />
          <figcaption className="p-4"><p className="font-heading text-base font-bold text-foreground">{ambassador.name}</p><p className="text-sm text-primary">Student Branch Ambassador · {ambassador.event}</p></figcaption>
        </figure>)}</div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((community) => { const Icon = community.icon; return <Card key={community.id} className="flex h-full flex-col overflow-hidden border-border transition-transform hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><div className="h-2" style={{ backgroundColor: community.color }} /><CardHeader><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-sm ${community.colorLogo ? "border bg-white" : ""}`} style={community.colorLogo ? undefined : { backgroundColor: community.color }}><img src={community.logoUrl} alt="" className={`size-8 object-contain ${community.colorLogo ? "" : "brightness-0 invert"}`} onError={(event) => { event.currentTarget.style.display = "none" }} /><Icon className="hidden size-7" aria-hidden="true" /></div><div><CardTitle className="font-heading text-xl leading-tight">{community.name}</CardTitle><Badge variant="secondary" className="mt-2">{community.category}</Badge></div></div><span className="rounded-full bg-muted px-2 py-1 text-xs font-bold text-primary">{community.initials}</span></div></CardHeader><CardContent className="flex-1"><p className="text-sm leading-relaxed text-muted-foreground">{community.description}</p><div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary"><span className="size-2 rounded-full bg-secondary" /> Enfoque: {community.opportunities}</div></CardContent><CardFooter className="flex flex-wrap gap-2"><Button asChild size="sm"><a href={community.joinUrl} target="_blank" rel="noreferrer">Unirme <ArrowUpRight data-icon="inline-end" /></a></Button><Button asChild size="sm" variant="outline"><a href={community.ambassadorUrl} target="_blank" rel="noreferrer"><UsersRound data-icon="inline-start" /> Ser embajador</a></Button><Button asChild size="sm" variant="ghost"><a href={community.collaborateUrl} target="_blank" rel="noreferrer"><Handshake data-icon="inline-start" /> Colaborar</a></Button>{community.extraLinks.map((link) => <Button key={link.url} asChild size="sm" variant="ghost"><a href={link.url} target="_blank" rel="noreferrer"><ExternalLink data-icon="inline-start" /> {link.label}</a></Button>)}</CardFooter></Card>})}</div>
      {visible.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No encontramos comunidades con esa búsqueda.</div>}
    </div>
  </section>
}
