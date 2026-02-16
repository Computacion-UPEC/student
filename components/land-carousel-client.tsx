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

type Props = {
  images: string[]
  autoplay?: boolean
  interval?: number
  className?: string
}

export default function LandCarouselClient({
  images,
  autoplay = true,
  interval = 5000,
  className,
}: Props) {
  const [api, setApi] = React.useState<CarouselApi | null>(null)

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
      <Carousel setApi={(a) => setApi(a)} className="h-full">
        <CarouselPrevious variant="ghost" className="bg-white/30" />
        <CarouselContent className="h-full">
          {images.map((src, i) => (
            <CarouselItem key={i}>
              <div className="h-full w-full overflow-hidden">
                <img src={src} alt={`slide-${i + 1}`} className="h-full w-full object-cover object-center" loading="lazy" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext variant="ghost" className="bg-white/30" />
      </Carousel>
    </div>
  )
}
