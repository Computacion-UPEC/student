"use client"

import { useEffect, useState } from "react"
import { BellRing } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const NEW_FOR_DAYS = 7

/** Marca una convocatoria detectada hace pocos días. Se calcula en el navegador para no depender del día del build. */
export function NewCallBadge({ since }: { since?: string }) {
  const [isNew, setIsNew] = useState(false)
  useEffect(() => {
    if (!since) return
    const days = (Date.now() - Date.parse(`${since}T00:00:00-05:00`)) / 864e5
    setIsNew(days >= 0 && days <= NEW_FOR_DAYS)
  }, [since])
  if (!isNew) return null
  return <Badge className="gap-1 bg-emerald-600 text-[11px] text-white hover:bg-emerald-600"><BellRing className="size-3" />Nueva convocatoria</Badge>
}
