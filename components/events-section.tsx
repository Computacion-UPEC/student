"use client"

import { useState } from "react"
import { events, type Event } from "@/lib/events-data"
import { EventCard } from "@/components/event-card"

const filterOptions: { label: string; value: string }[] = [
  { label: "Todos", value: "all" },
  { label: "COMC", value: "COMC" },
  { label: "IEEE", value: "IEEE" },
  { label: "COMC & IEEE", value: "COMC & IEEE" },
]

const typeOptions: { label: string; value: string }[] = [
  { label: "Todos", value: "all" },
  { label: "Workshop", value: "Workshop" },
  { label: "Charla", value: "Charla" },
  { label: "Seminario", value: "Seminario" },
  { label: "Hackathon", value: "Hackathon" },
  { label: "Meetup", value: "Meetup" },
]

export function EventsSection() {
  const [orgFilter, setOrgFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredEvents = events.filter((event) => {
    const matchesOrg = orgFilter === "all" || event.organization === orgFilter || event.organization.includes(orgFilter)
    const matchesType = typeFilter === "all" || event.type === typeFilter
    return matchesOrg && matchesType
  })

  return (
    <section id="eventos" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Nuestros Eventos
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Explora los eventos, workshops y charlas que hemos organizado
          </p>
        </div>

        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Org:</span>
            {filterOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setOrgFilter(option.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  orgFilter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="hidden h-6 w-px bg-border sm:block" />

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo:</span>
            {typeOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setTypeFilter(option.value)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  typeFilter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">No se encontraron eventos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  )
}
