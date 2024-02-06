import { type Structure } from 'definitions/structures'
import { Sprite } from '@pixi/react'
import type HitAreaShapes from 'utils/pixiJs/hitAreaShapes'
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView'
import { type Point } from 'pixi.js'
import { sprites } from 'bundles/sprites'
import ParticleEmitter from 'components/pixi/ParticleEmitter'
import smoke from './smoke.json'

export type Props = {
  onStructureClick: (structure: Structure | null) => void
  position: Point
  selected?: boolean
  structure: Structure
  hitAreaShapes: HitAreaShapes
}

const getImagePath = (structure: string): string => {
  switch (structure) {
    case 'workshop':
      return sprites.TOWN_STRUCTURE_WORKSHOP
    case 'quarry':
      return sprites.TOWN_STRUCTURE_QUARRY
    case 'tannery':
      return sprites.TOWN_STRUCTURE_TANNERY
    case 'alchemist':
      return sprites.TOWN_STRUCTURE_ALCHEMIST
    case 'garden':
      return sprites.TOWN_STRUCTURE_GARDEN
    case 'weaponsmith':
      return sprites.TOWN_STRUCTURE_WEAPONSMITH
    case 'armoursmith':
      return sprites.TOWN_STRUCTURE_ARMOURSMITH
    case 'warehouse':
      return sprites.TOWN_STRUCTURE_WAREHOUSE
    case 'mine':
      return sprites.TOWN_STRUCTURE_MINE
    case 'weaver':
      return sprites.TOWN_STRUCTURE_WEAVER
    case 'lumberMill':
      return sprites.TOWN_STRUCTURE_LUMBERMILL
    case 'tavern':
      return sprites.TOWN_STRUCTURE_TAVERN
  }
  throw new Error()
}

const Generic = (props: Props) => {
  const { structure, position, hitAreaShapes, selected, onStructureClick } = props
  const filters = selected === true ? [STRUCTURE_HIGHLIGHT_FILTER] : []

  const handlePointerTap = () => {
    onStructureClick(structure)
  }

  return (
    <Sprite
      name={structure}
      position={position}
      eventMode='static'
      pointerdown={handlePointerTap}
      hitArea={hitAreaShapes}
      filters={filters}
      image={getImagePath(structure)}
    >
      {/* <Graphics
        name="hitarea"
        draw={graphics => {
          graphics.beginFill(0xffffff);
          hitAreaShapes.shapes.map(shape => graphics.drawPolygon(shape))
          graphics.endFill();
        }}
      /> */}
      { structure === 'quarry' && (
      <ParticleEmitter
        name="smoke"
        x={66}
        y={-2}
        image={sprites.TOWN_EFFECT_SMOKEPARTICLE}
        config={smoke}
      />)}
    </Sprite>
  )
}
export default Generic
