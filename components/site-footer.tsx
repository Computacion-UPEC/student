export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Logos row */}
          <div className="flex items-center gap-6">
            <img
              src="/images/logo-computacion-new.jpg"
              alt="Carrera de Computacion - Politecnica del Carchi"
              className="h-14 w-14 rounded-full border-2 border-primary-foreground/20"
            />
            <div className="h-10 w-px bg-primary-foreground/20" />
            <div className="flex flex-col text-left">
              <span className="font-heading text-sm font-bold text-primary-foreground">
                COMC & IEEE Student Branch
              </span>
              <span className="text-xs text-primary-foreground/60">
                Carrera de Computacion - UPEC
              </span>
            </div>
          </div>

          <p className="max-w-md text-sm text-primary-foreground/60 leading-relaxed">
            Promoviendo la innovacion tecnologica, la optimizacion matematica y
            el desarrollo profesional en la comunidad universitaria.
          </p>

          {/* Banner strip */}
          <div className="w-full max-w-lg overflow-hidden rounded-xl opacity-60">
            <img
              src="/images/banner-computacion.jpg"
              alt="Carrera de Computacion UPEC"
              className="h-16 w-full object-cover"
            />
          </div>

          <div className="h-px w-full max-w-xs bg-primary-foreground/10" />

          <p className="text-xs text-primary-foreground/40">
            {new Date().getFullYear()} COMC & IEEE Student Branch UPEC -
            Carrera de Computacion, Politecnica del Carchi. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
