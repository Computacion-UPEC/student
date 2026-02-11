"use client"

import { Linkedin, Github, Globe, Star } from "lucide-react"
import { allSpeakers, getSpeakerStars } from "@/lib/events-data"
import type { Speaker } from "@/lib/events-data"

export function CompositeImage({
  speaker,
  size = "lg",
}: {
  speaker: Speaker
  size?: "sm" | "lg"
}) {
  const initials = speaker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const sizeClasses = size === "lg" ? "h-40 w-40" : "h-14 w-14"
  const borderClasses = size === "lg" ? "border-4" : "border-2"

  if (!speaker.cropBox) {
    return (
      <div className={`${sizeClasses} overflow-hidden rounded-full ${borderClasses} border-secondary`}>
        <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-primary-foreground">
          {initials}
        </div>
      </div>
    )
  }

  const { cx, cy, zoom } = speaker.cropBox
  // Use background-image with precise positioning
  // zoom controls how much to scale the composite (higher = more zoomed in)
  const bgSize = `${zoom * 100}%`
  // Position the background so the speaker's face is centered
  const bgPosX = `${cx}%`
  const bgPosY = `${cy}%`

  return (
    <div
      className={`${sizeClasses} overflow-hidden rounded-full ${borderClasses} border-secondary bg-background`}
      role="img"
      aria-label={speaker.name}
      style={{
        backgroundImage: "url(/speakers/composite.jpg)",
        backgroundSize: bgSize,
        backgroundPosition: `${bgPosX} ${bgPosY}`,
        backgroundRepeat: "no-repeat",
      }}
    />
  )
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count
              ? "fill-secondary text-secondary"
              : "text-border"
          }`}
        />
      ))}
    </div>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const stars = getSpeakerStars(speaker)

  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <div className="mb-5">
        <CompositeImage speaker={speaker} size="lg" />
      </div>

      <StarRating count={stars} />

      <h3 className="mt-3 font-heading text-xl font-bold text-foreground">{speaker.name}</h3>
      <p className="mt-1 text-sm font-medium text-primary">{speaker.title}</p>
      <p className="mt-2 rounded-full bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
        {speaker.topic}
      </p>

      <div className="mt-5 flex items-center gap-3">
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-[#0A66C2] hover:text-[#fff]"
            aria-label={`LinkedIn de ${speaker.name}`}
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {speaker.github && (
          <a
            href={speaker.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-foreground hover:text-background"
            aria-label={`GitHub de ${speaker.name}`}
          >
            <Github className="h-5 w-5" />
          </a>
        )}
        {speaker.website && (
          <a
            href={speaker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
            aria-label={`Sitio web de ${speaker.name}`}
          >
            <Globe className="h-5 w-5" />
          </a>
        )}
      </div>
    </div>
  )
}

export function SpeakersSection() {
  // Sort speakers by star count (descending)
  const sortedSpeakers = [...allSpeakers].sort(
    (a, b) => getSpeakerStars(b) - getSpeakerStars(a)
  )

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
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              LinkedIn
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {"+ GitHub / Web"}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
              {"LinkedIn + GitHub + Web"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
        </div>
      </div>
    </section>
  )
}
