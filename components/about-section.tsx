import { BookOpen, Cpu } from "lucide-react"
import { organizations } from "@/lib/events-data"

export function AboutSection() {
  const icons = [BookOpen, Cpu]

  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Nuestras Organizaciones
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Dos organizaciones unidas por la innovacion y el conocimiento
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {organizations.map((org, index) => {
            const Icon = icons[index]
            return (
              <div
                key={org.shortName}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-8"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{org.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-secondary">{org.shortName}</p>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{org.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
