import { useState, useEffect } from 'react'
import { type Structure } from 'definitions/structures'
import { Sprite, useApp, useTick } from '@pixi/react'
import type HitAreaShapes from 'utils/pixiJs/hitAreaShapes'
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView'
import { Assets, Point, type Spritesheet, type Texture } from 'pixi.js'
import { sprites } from 'bundles/sprites'

const BLADE_ROTATION_SPEED = 0.01

export type Props = {
  onStructureClick: (structure: Structure | null) => void
  position: Point
  selected?: boolean
  hitAreaShapes: HitAreaShapes
}

const LumberMill = (props: Props) => {
  const { hitAreaShapes } = props
  const structure: Structure = 'lumberMill'
  const atlas = sprites.TOWN_STRUCTURE_LUMBER_MILL
  const [textures, setTextures] = useState<Record<string, Texture>>()
  const filters = props.selected === true ? [STRUCTURE_HIGHLIGHT_FILTER] : []

  const app = useApp()

  useEffect(() => {
    void Assets.load<Spritesheet>(atlas).then((resource) => {
      setTextures(resource.textures)
    })
  }, [app, atlas])

  const [rotation, setRotation] = useState(0)
  useTick((delta: number | undefined) => { setRotation(r => r + (BLADE_ROTATION_SPEED * (delta ?? 0))) })

  if (textures == null) return null
  return (
    <Sprite
      name={structure}
      position={props.position}
      eventMode='static'
      pointerdown={() => {
        props.onStructureClick(structure)
      }}
      hitArea={hitAreaShapes}
      filters={filters}
      texture={textures['structure.png']}
    >
      <Sprite
        name="blades"
        texture={textures['blades.png']}
        anchor={new Point(0.5, 0.5)}
        x={15}
        y={10}
        rotation={rotation}
      />
    </Sprite>
  )
}

export default LumberMill
