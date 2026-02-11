"use client"

import { useState } from "react"
import { Linkedin, Github, Globe } from "lucide-react"
import { events } from "@/lib/events-data"
import type { Speaker } from "@/lib/events-data"

function getUniqueSpeakers(): (Speaker & { events: string[] })[] {
  const speakerMap = new Map<string, Speaker & { events: string[] }>()
  for (const event of events) {
    for (const speaker of event.speakers) {
      if (speakerMap.has(speaker.name)) {
        speakerMap.get(speaker.name)!.events.push(event.title)
      } else {
        speakerMap.set(speaker.name, { ...speaker, events: [event.title] })
      }
    }
  }
  return Array.from(speakerMap.values())
}

function SpeakerCard({ speaker }: { speaker: Speaker & { events: string[] } }) {
  const [imgError, setImgError] = useState(false)
  const initials = speaker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-secondary">
        {!imgError ? (
          <img
            src={speaker.photo || "/placeholder.svg"}
            alt={speaker.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-primary-foreground">
            {initials}
          </div>
        )}
      </div>

      <h3 className="font-heading text-lg font-bold text-foreground">{speaker.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{speaker.title}</p>

      <div className="mt-3 flex items-center gap-3">
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
            aria-label={`LinkedIn de ${speaker.name}`}
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {speaker.github && (
          <a
            href={speaker.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
            aria-label={`GitHub de ${speaker.name}`}
          >
            <Github className="h-4 w-4" />
          </a>
        )}
        {speaker.website && (
          <a
            href={speaker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
            aria-label={`Sitio web de ${speaker.name}`}
          >
            <Globe className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="mt-4 w-full border-t border-border pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Participo en</p>
        <ul className="mt-2 flex flex-col gap-1">
          {speaker.events.map((eventTitle) => (
            <li key={eventTitle} className="text-xs text-foreground leading-relaxed">
              {eventTitle}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function SpeakersSection() {
  const speakers = getUniqueSpeakers()

  return (
    <section id="speakers" className="border-t border-border bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Nuestros Speakers
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Conoce a los profesionales y expertos que han compartido su conocimiento
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {speakers.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
        </div>
      </div>
    </section>
  )
}
