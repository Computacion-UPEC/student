"use client"

import { Linkedin, Github, Globe, Star, ExternalLink } from "lucide-react"
import { allSpeakers, getSpeakerStars } from "@/lib/events-data"
import type { Speaker } from "@/lib/events-data"

export function CompositeImage({
  speaker,
  size = "lg",
}: {
  speaker: Speaker
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}) {
  const initials = speaker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const sizeMap: Record<string, string> = {
    sm: "h-14 w-14",
    md: "h-20 w-20",
    lg: "h-40 w-40",
    xl: "h-56 w-56",
    "2xl": "h-72 w-72 md:h-80 md:w-80",
  }
  const borderMap: Record<string, string> = {
    sm: "border-2",
    md: "border-[3px]",
    lg: "border-4",
    xl: "border-4",
    "2xl": "border-[5px]",
  }
  const textMap: Record<string, string> = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
    "2xl": "text-5xl",
  }

  const sizeClasses = sizeMap[size]
  const borderClasses = borderMap[size]
  const textClasses = textMap[size]

  if (!speaker.cropBox) {
    return (
      <div
        className={`${sizeClasses} shrink-0 overflow-hidden rounded-full ${borderClasses} border-secondary`}
      >
        <div
          className={`flex h-full w-full items-center justify-center bg-primary ${textClasses} font-bold text-primary-foreground`}
        >
          {initials}
        </div>
      </div>
    )
  }

  const { cx, cy, zoom } = speaker.cropBox
  const bgSize = `${zoom * 100}%`
  const bgPosX = `${cx}%`
  const bgPosY = `${cy}%`

  return (
    <div
      className={`${sizeClasses} shrink-0 overflow-hidden rounded-full ${borderClasses} border-secondary bg-muted`}
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
    <div className="flex items-center gap-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < count ? "fill-secondary text-secondary" : "text-border"
          }`}
        />
      ))}
    </div>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const stars = getSpeakerStars(speaker)

  return (
    <div className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
      {/* Top accent bar */}
      <div className="h-2 w-full bg-gradient-to-r from-primary via-primary/80 to-secondary" />

      {/* Photo area - MUCH larger */}
      <div className="relative flex w-full items-center justify-center bg-muted/30 pb-10 pt-12">
        {/* Decorative dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* UPEC Computacion small badge top-right */}
        <div className="absolute right-4 top-4">
          <img
            src="/images/logo-computacion-new.jpg"
            alt="Carrera de Computacion UPEC"
            className="h-10 w-10 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="relative">
          {/* Large avatar - 2xl size (320px on desktop) */}
          <CompositeImage speaker={speaker} size="2xl" />
          {/* Star badge overlay */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border-2 border-card bg-card px-4 py-1.5 shadow-lg">
            <StarRating count={stars} />
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="flex w-full flex-1 flex-col items-center px-8 pb-10 pt-8">
        <h3 className="font-heading text-2xl font-bold text-foreground text-center text-balance md:text-3xl">
          {speaker.name}
        </h3>
        <p className="mt-1.5 text-base font-semibold text-primary">
          {speaker.title}
        </p>

        {/* Topic pill */}
        <div className="mt-5 rounded-full border border-primary/20 bg-primary/5 px-6 py-2.5 text-sm font-medium text-primary text-center">
          {speaker.topic}
        </div>

        {/* Social links - larger */}
        <div className="mt-7 flex items-center gap-4">
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-[#0A66C2] hover:text-[#fff] hover:shadow-lg hover:shadow-[#0A66C2]/20 hover:scale-110"
              aria-label={`LinkedIn de ${speaker.name}`}
            >
              <Linkedin className="h-6 w-6" />
            </a>
          )}
          {speaker.github && (
            <a
              href={speaker.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-foreground hover:text-background hover:shadow-lg hover:scale-110"
              aria-label={`GitHub de ${speaker.name}`}
            >
              <Github className="h-6 w-6" />
            </a>
          )}
          {speaker.website && (
            <a
              href={speaker.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:scale-110"
              aria-label={`Sitio web de ${speaker.name}`}
            >
              <Globe className="h-6 w-6" />
            </a>
          )}
        </div>

        {/* Visit website link */}
        {speaker.website && (
          <a
            href={speaker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            Visitar sitio web
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

export function SpeakersSection() {
  const sortedSpeakers = [...allSpeakers].sort(
    (a, b) => getSpeakerStars(b) - getSpeakerStars(a),
  )

  return (
    <section
      id="speakers"
      className="border-t border-border bg-muted/30 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header with brand */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <img
              src="/images/logo-computacion-new.jpg"
              alt="Carrera de Computacion UPEC"
              className="h-14 w-14 rounded-full shadow-md"
            />
          </div>
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Carrera de Computacion - UPEC
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            Speakers destacados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
            Conoce a los profesionales y expertos que han compartido su
            conocimiento en nuestros eventos
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              LinkedIn
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              {"+ GitHub / Web"}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              {"Todas las plataformas"}
            </span>
          </div>
        </div>

        {/* 2-column grid for larger cards */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {sortedSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
        </div>
      </div>
    </section>
  )
}
