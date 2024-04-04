import { useState } from 'react'
import { type Structure } from 'definitions/structures'
import { Sprite, useTick } from '@pixi/react'
import type HitAreaShapes from 'utils/pixiJs/hitAreaShapes'
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView'
import { Assets, Point, type Spritesheet } from 'pixi.js'
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
  const atlas = sprites.town.STRUCTURE_LUMBER_MILL
  const filters = props.selected === true ? [STRUCTURE_HIGHLIGHT_FILTER] : []

  const textures = Assets.get<Spritesheet>(atlas).textures

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
