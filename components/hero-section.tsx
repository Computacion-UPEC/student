import { Calendar, Users, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Banner background image */}
      <div className="absolute inset-0">
        <img
          src="/images/banner-computacion.jpg"
          alt=""
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
      </div>

      <div className="relative py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            {/* Logo badge */}
            <div className="mb-8 flex items-center gap-4">
              <img
                src="/images/logo-computacion-new.jpg"
                alt="Carrera de Computacion - Politecnica del Carchi"
                className="h-16 w-16 rounded-full border-2 border-secondary shadow-xl md:h-20 md:w-20"
              />
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-primary-foreground">
                Carrera de Computacion - Universidad Politecnica Estatal del
                Carchi
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl text-balance">
              Eventos & Workshops
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 text-pretty">
              Descubre los eventos organizados por el Club de Optimizacion y
              Matematica Computacional y la rama IEEE Student Branch UPEC
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-6 py-4 backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary-foreground">
                    9+
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    Eventos realizados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-6 py-4 backdrop-blur-sm">
                <Users className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary-foreground">
                    12
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    Speakers invitados
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-6 py-4 backdrop-blur-sm">
                <Zap className="h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="text-2xl font-bold text-primary-foreground">
                    2
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    Organizaciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
