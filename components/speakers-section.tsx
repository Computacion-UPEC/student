import { Linkedin, Github, Globe, Star, ExternalLink } from "lucide-react"
import { allSpeakers, getSpeakerStars } from "@/lib/events-data"
import type { Speaker } from "@/lib/events-data"

export function CompositeImage({
  speaker,
  size = "lg",
}: {
  speaker: Speaker
  size?: "sm" | "md" | "lg" | "xl"
}) {
  if (!speaker.image) {
    const initials = speaker.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)

    const sizeMap = {
      sm: "h-14 w-14",
      md: "h-20 w-20",
      lg: "h-40 w-40",
      xl: "h-56 w-56",
    }
    const borderMap = {
      sm: "border-2",
      md: "border-[3px]",
      lg: "border-4",
      xl: "border-4",
    }
    const textMap = {
      sm: "text-sm",
      md: "text-lg",
      lg: "text-2xl",
      xl: "text-3xl",
    }

    const sizeClasses = sizeMap[size]
    const borderClasses = borderMap[size]
    const textClasses = textMap[size]

    return (
      <div className={`${sizeClasses} shrink-0 overflow-hidden rounded-full ${borderClasses} border-secondary`}>
        <div className={`flex h-full w-full items-center justify-center bg-primary ${textClasses} font-bold text-primary-foreground`}>
          {initials}
        </div>
      </div>
    )
  }

  const sizeMap = {
    sm: "h-14 w-14",
    md: "h-20 w-20",
    lg: "h-40 w-40",
    xl: "h-56 w-56",
  }
  const borderMap = {
    sm: "border-2",
    md: "border-[3px]",
    lg: "border-4",
    xl: "border-4",
  }

  const sizeClasses = sizeMap[size]
  const borderClasses = borderMap[size]

  return (
    <div className={`${sizeClasses} shrink-0 overflow-hidden rounded-full ${borderClasses} border-secondary bg-background`} role="img" aria-label={speaker.name}>
      <img
        src={encodeURI(speaker.image)}
        alt={speaker.name}
        className={`h-full w-full object-cover`}
        style={{ objectPosition: speaker.imagePosition ?? "center" }}
        loading="lazy"
      />
    </div>
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
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-secondary" />

      {/* Photo area with decorative background */}
      <div className="relative flex w-full items-center justify-center bg-muted/40 pb-8 pt-10">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative">
          <CompositeImage speaker={speaker} size="xl" />
          {/* Star badge overlay */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full border-2 border-card bg-card px-3 py-1 shadow-md">
            <StarRating count={stars} />
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="flex w-full flex-1 flex-col items-center px-6 pb-8 pt-6">
        <h3 className="font-heading text-2xl font-bold text-foreground text-center text-balance">
          {speaker.name}
        </h3>
        <p className="mt-1 text-base font-medium text-primary">{speaker.title}</p>

        {/* Topic pill */}
        <div className="mt-4 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary">
          {speaker.topic}
        </div>

        {/* Social links */}
        <div className="mt-6 flex items-center gap-3">
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-[#0A66C2] hover:text-[#fff] hover:shadow-lg hover:shadow-[#0A66C2]/20 hover:scale-110"
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
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-foreground hover:text-background hover:shadow-lg hover:scale-110"
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
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 hover:scale-110"
              aria-label={`Sitio web de ${speaker.name}`}
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
        </div>

        {/* Visit website link for those with a site */}
        {speaker.website && (
          <a
            href={speaker.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
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
    <section id="speakers" className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            Nuestro equipo
          </span>
          <h2 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl text-balance">
            Speakers destacados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
            Conoce a los profesionales y expertos que han compartido su conocimiento en nuestros eventos
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

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {sortedSpeakers.map((speaker) => (
            <SpeakerCard key={speaker.name} speaker={speaker} />
          ))}
        </div>
      </div>
    </section>
  )
}