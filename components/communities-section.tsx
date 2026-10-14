"use client"

import { useMemo, useState } from "react"
import { ArrowUpRight, Handshake, Search, Sparkles, UsersRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { communities } from "@/lib/communities-data"

export function CommunitiesSection() {
  const [query, setQuery] = useState("")
  const visible = useMemo(() => communities.filter((community) => `${community.name} ${community.category} ${community.description} ${community.opportunities}`.toLowerCase().includes(query.toLowerCase())), [query])

  return <section className="border-t border-border bg-muted/30 py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-6">
      <div className="mb-10 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary p-5 text-primary-foreground"><Sparkles className="shrink-0 text-secondary" /><p className="text-sm leading-relaxed text-primary-foreground/85"><span className="font-semibold text-primary-foreground">Tu siguiente conexión puede cambiar tu carrera.</span> Únete, participa en eventos y convierte tus proyectos en oportunidades.</p></div>
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between md:p-5"><div><h2 className="font-heading text-2xl font-bold md:text-3xl">Explora la red</h2><p className="mt-1 text-sm text-muted-foreground">{communities.length} comunidades para aprender y colaborar.</p></div><label className="relative block w-full md:max-w-sm"><span className="sr-only">Buscar comunidades</span><Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cloud, open source, IA..." className="pl-10" /></label></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((community) => { const Icon = community.icon; return <Card key={community.id} className="flex h-full flex-col overflow-hidden border-border transition-transform hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><div className="h-2" style={{ backgroundColor: community.color }} /><CardHeader><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-sm" style={{ backgroundColor: community.color }}><Icon className="size-7" aria-hidden="true" /></div><div><CardTitle className="font-heading text-xl leading-tight">{community.name}</CardTitle><Badge variant="secondary" className="mt-2">{community.category}</Badge></div></div><span className="rounded-full bg-muted px-2 py-1 text-xs font-bold text-primary">{community.initials}</span></div></CardHeader><CardContent className="flex-1"><p className="text-sm leading-relaxed text-muted-foreground">{community.description}</p><div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary"><span className="size-2 rounded-full bg-secondary" /> Enfoque: {community.opportunities}</div></CardContent><CardFooter className="flex flex-wrap gap-2"><Button asChild size="sm"><a href={community.joinUrl} target="_blank" rel="noreferrer">Unirme <ArrowUpRight data-icon="inline-end" /></a></Button><Button asChild size="sm" variant="outline"><a href={community.ambassadorUrl} target="_blank" rel="noreferrer"><UsersRound data-icon="inline-start" /> Ser embajador</a></Button><Button asChild size="sm" variant="ghost"><a href={community.collaborateUrl} target="_blank" rel="noreferrer"><Handshake data-icon="inline-start" /> Colaborar</a></Button></CardFooter></Card>})}</div>
      {visible.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">No encontramos comunidades con esa búsqueda.</div>}
    </div>
  </section>
}
