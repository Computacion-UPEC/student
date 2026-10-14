import { Calendar, Users, Zap } from "lucide-react"
import LandCarouselClient from "@/components/land-carousel-client"
import { landImagesData } from "@/lib/land-images"

export function HeroSection() {
  const fallbackBg = landImagesData && landImagesData.length > 0 ? landImagesData[0] : null

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-primary py-20 md:py-32"
      style={
        fallbackBg
          ? {
              backgroundImage: `url(${fallbackBg.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: fallbackBg.position ?? 'center',
            }
          : undefined
      }
    >
      {/* Carrusel como fondo full-bleed con transparencia */}
      {landImagesData && landImagesData.length > 0 && (
        <div className="absolute inset-0 z-0 h-full">
          <LandCarouselClient
            images={landImagesData}
            className="h-full w-full opacity-60"
            autoplay
            interval={4500}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}



      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-secondary" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-secondary" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2">
            <img src="/images/logo-computacion.jpg" alt="Logo Computación" className="h-6 w-6 rounded-full object-cover" />
            <Zap className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">
              Universidad Politecnica Estatal del Carchi
            </span>
          </div>

          <h1 className="font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl text-balance">
            Computación UPEC
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80 text-pretty">
            Descubre los eventos organizados por el Club de Optimizacion y Matematica Computacional y la rama IEEE Student Branch UPEC
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-6 py-4">
              <Calendar className="h-5 w-5 text-secondary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-primary-foreground">9+</p>
                <p className="text-sm text-primary-foreground/70">Eventos realizados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-6 py-4">
              <Users className="h-5 w-5 text-secondary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-primary-foreground">12</p>
                <p className="text-sm text-primary-foreground/70">Speakers invitados</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-6 py-4">
              <Zap className="h-5 w-5 text-secondary" />
              <div className="text-left">
                <p className="text-2xl font-bold text-primary-foreground">2</p>
                <p className="text-sm text-primary-foreground/70">Organizaciones</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  )
}

