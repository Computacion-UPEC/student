import { readdirSync, existsSync, readFileSync } from 'fs'
import path from 'path'

// Lee images + un optional positions.json (mapeo filename => CSS object-position)
const LAND_DIR = path.resolve(process.cwd(), 'public', 'images', 'land')

function readPositions(): Record<string, string> {
  try {
    const positionsPath = path.join(LAND_DIR, 'positions.json')
    if (!existsSync(positionsPath)) return {}
    const raw = readFileSync(positionsPath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    return {}
  }
}

const positions = readPositions()

export const landImagesData: { src: string; position?: string }[] = (() => {
  try {
    if (!existsSync(LAND_DIR)) return []
    const files = readdirSync(LAND_DIR)
    const images = files
      .filter((f) => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f))
      .sort()
      .map((f) => ({ src: `/images/land/${f}`, position: positions[f] }))

    return images
  } catch (err) {
    return []
  }
})()

// Mantener compatibilidad: exportar también solo las rutas (string[])
export const landImages: string[] = landImagesData.map((i) => i.src)
export default landImages


