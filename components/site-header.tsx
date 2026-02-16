"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <img
            src="/images/logo-computacion-new.jpg"
            alt="Carrera de Computacion - Politecnica del Carchi"
            className="h-11 w-11 rounded-full"
          />
          <div className="hidden h-8 w-px bg-border sm:block" />
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold leading-tight text-foreground">
              COMC & IEEE Student Branch
            </span>
            <span className="text-xs text-muted-foreground">
              Carrera de Computacion - UPEC
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#eventos"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Eventos
          </a>
          <a
            href="#speakers"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Speakers
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Nosotros
          </a>
        </nav>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#eventos"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Eventos
            </a>
            <a
              href="#speakers"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Speakers
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Nosotros
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
