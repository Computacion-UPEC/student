/** Aviso de ofertas de años anteriores ocultas, con el botón para verlas (filtro "Históricos"). */
export function HistoricNote({ count, onShow }: { count: number; onShow: () => void }) {
  if (count === 0) return null
  return <p className="mt-3 text-xs text-muted-foreground">{count} de años anteriores ocultas. <button type="button" onClick={onShow} className="font-semibold text-primary hover:underline">Ver históricos</button></p>
}
