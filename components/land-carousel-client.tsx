'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'

// cada item puede ser una string (src) o un objeto con src + position (CSS object-position)
type ImageItem = string | { src: string; position?: string }

type Props = {
  images: ImageItem[]
  autoplay?: boolean
  loop?: boolean
  interval?: number
  className?: string
}

export default function LandCarouselClient({
  images,
  autoplay = true,
  loop = true,
  interval = 5000,
  className,
}: Props) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)

  // ocultar background SSR del hero cuando el cliente monta (evita duplicado)
  React.useEffect(() => {
    try {
      const hero = document.getElementById('hero')
      if (hero) hero.style.backgroundImage = 'none'
    } catch (err) {
      // noop
    }

    // Ajustar la altura del #hero para que sea `100vh - headerHeight`
    const headerSelector = 'header'
    const headerEl = () => document.querySelector(headerSelector) as HTMLElement | null
    const heroEl = () => document.getElementById('hero')

    const update = () => {
      const h = headerEl()
      const hero = heroEl()
      if (!hero) return
      const headerHeight = h ? h.offsetHeight : 0
      // usar height explícito para que porcentajes internos (h-full) funcionen correctamente
      hero.style.height = `calc(100vh - ${headerHeight}px)`
      // asegurar que el contenedor no crezca por padding
      hero.style.boxSizing = 'border-box'
    }

    update()
    window.addEventListener('resize', update)

    let ro: ResizeObserver | null = null
    const h = headerEl()
    if (h && 'ResizeObserver' in window) {
      ro = new ResizeObserver(update)
      ro.observe(h)
    }

    return () => {
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (!autoplay || !api || images.length <= 1) return

    const id = setInterval(() => {
      api.scrollNext()
    }, interval)

    return () => clearInterval(id)
  }, [api, autoplay, interval, images.length])

  if (!images || images.length === 0) return null

  return (
    <div className={cn('h-full w-full', className)}>
      <Carousel setApi={(a) => setApi(a)} opts={{ loop }} className="h-full">
        <CarouselPrevious variant="ghost" className="bg-white/30" />
        <CarouselContent className="h-full">
          {images.map((item, i) => {
            const src = typeof item === 'string' ? item : item.src
            const objectPosition = typeof item === 'string' ? 'center' : item.position ?? 'center'

            return (
              <CarouselItem key={i}>
                <div className="h-full w-full overflow-hidden">
                  <img
                    src={src}
                    alt={`slide-${i + 1}`}
                    className="h-full w-full object-cover"
                    style={{ objectPosition }}
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselNext variant="ghost" className="bg-white/30" />
      </Carousel>
    </div>
  )
}
