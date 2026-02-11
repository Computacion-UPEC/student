export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-primary py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <span className="font-heading text-lg font-bold text-primary-foreground">C</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading text-sm font-bold text-primary-foreground">COMC & IEEE Student Branch</span>
              <span className="text-xs text-primary-foreground/60">
                Universidad Politecnica Estatal del Carchi
              </span>
            </div>
          </div>

          <p className="max-w-md text-sm text-primary-foreground/60 leading-relaxed">
            Promoviendo la innovacion tecnologica, la optimizacion matematica y el desarrollo profesional en la comunidad universitaria.
          </p>

          <div className="h-px w-full max-w-xs bg-primary-foreground/10" />

          <p className="text-xs text-primary-foreground/40">
            {new Date().getFullYear()} COMC & IEEE Student Branch UPEC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
