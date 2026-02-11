"use client"

import { Calendar, Clock, MapPin, Linkedin, Github, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/events-data"
import { useState } from "react"

function SpeakerAvatar({ speaker }: { speaker: Event["speakers"][number] }) {
  const [imgError, setImgError] = useState(false)
  const initials = speaker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-muted/50 p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-secondary">
        {!imgError ? (
          <img
            src={speaker.photo || "/placeholder.svg"}
            alt={speaker.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary text-sm font-bold text-primary-foreground">
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading text-sm font-semibold text-foreground truncate">{speaker.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{speaker.title}</p>
        <div className="mt-2 flex items-center gap-2">
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
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
              className="text-muted-foreground transition-colors hover:text-primary"
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
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label={`Sitio web de ${speaker.name}`}
            >
              <Globe className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

const typeColors: Record<Event["type"], string> = {
  Workshop: "bg-secondary text-secondary-foreground",
  Charla: "bg-primary text-primary-foreground",
  Hackathon: "bg-destructive text-destructive-foreground",
  Seminario: "bg-primary/80 text-primary-foreground",
  Meetup: "bg-secondary/80 text-secondary-foreground",
}

const orgColors: Record<Event["organization"], string> = {
  COMC: "border-primary text-primary",
  IEEE: "border-secondary text-secondary-foreground bg-secondary/20",
  "COMC & IEEE": "border-primary text-primary bg-primary/10",
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${typeColors[event.type]}`}>
          {event.type}
        </span>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${orgColors[event.organization]}`}>
          {event.organization}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-heading text-xl font-bold text-foreground leading-tight text-balance">
          {event.title}
        </h3>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed text-pretty">
          {event.description}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {event.time} <span className="text-muted-foreground">({event.timezone})</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Speakers
          </p>
          <div className="flex flex-col gap-3">
            {event.speakers.map((speaker) => (
              <SpeakerAvatar key={speaker.name} speaker={speaker} />
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs border-border text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  )
}
