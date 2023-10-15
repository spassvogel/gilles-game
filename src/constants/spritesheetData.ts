
export type SpritesheetData = {
  frames: Record<string, SpriteData>
  meta: {
    image: string
    size: Size
    scale: string
  }
}

export type SpriteData = {
  frame: Frame
  rotated?: boolean
  trimmed?: boolean
  spriteSourceSize?: Frame
  sourceSize?: Size
}

type Position = { x: number, y: number }
type Size = { w: number, h: number }
type Frame = Size & Position
