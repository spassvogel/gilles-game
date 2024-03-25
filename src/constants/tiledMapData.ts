export type TiledMapData = {
  width: number
  height: number
  tilewidth: number
  tileheight: number
  infinite: boolean
  backgroundcolor: string | null
  orientation: Orientation
  renderorder: RenderOrder
  tilesets: TiledTilesetData[]
  layers: TiledLayerData[]
}

export type TiledTilesetData = {
  columns: number
  firstgid: number
  source: string
  image: string
  imagewidth: number
  imageheight: number
  tilewidth: number
  tileheight: number
  tilecount: number
  name: string
  margin: number // todo:
  spacing: number // todo
  tiles?: TileData[]
}

export type TileData = {
  id: number
  image: string
  type: string
  properties?: TiledProperty[]
}

export type TiledLayerData = {
  data: number[]
  objects: TiledObjectData[]
  type: TiledLayerType
  height: number
  id: number
  name: string
  opacity: number // not supported atm
  visible: boolean
  x: number
  y: number
  width: number
  properties?: TiledProperty[]
}

export type TiledObjectData = {
  gid?: number
  id: number | string
  name?: string
  properties?: TiledProperty[]
  polygon?: Array<{ x: number, y: number }>
  type: string
  visible: boolean
  width: number
  height: number
  x: number
  y: number
}

export enum TiledLayerType {
  tilelayer = 'tilelayer',
  objectgroup = 'objectgroup',
}

export type TiledProperty = {
  name: string
  type: string
  value: string | number | boolean
}

enum Orientation {
  orthagonal = 'orthagonal',
  isometric = 'isometric',
  staggered = 'staggered',
  hexagonal = 'hexagonal',
}

enum RenderOrder {
  rightUp = 'right-up',
  rightDown = 'right-down',
  leftUp = 'left-up',
  leftDown = 'left-down',
}

// todo: 2024-03-25 Strip down objects => rename to 'objects'
export const LAYER_ACTOR = 'actor'
