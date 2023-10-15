import { lerp } from './math'

export type Coords = {
  x: number
  y: number
}

export const lerpLocation = (point1: Coords, point2: Coords, alpha: number): Coords => {
  const x = lerp(point1.x, point2.x, alpha)
  const y = lerp(point1.y, point2.y, alpha)
  return { x, y }
}
