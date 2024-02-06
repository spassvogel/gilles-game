import { Sprite, Container } from '@pixi/react'
import { type Point } from 'pixi.js'
import { type Structure } from 'definitions/structures'
import type HitAreaShapes from 'utils/pixiJs/hitAreaShapes'
import smoke from './smoke.json'
import ParticleEmitter from 'components/pixi/ParticleEmitter'
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView'
import { sprites } from 'bundles/sprites'

export type Props = {
  onStructureClick: (structure: Structure | null) => void
  position: Point
  selected?: boolean
  hitAreaShapes: HitAreaShapes
}

const Tavern = (props: Props) => {
  const { hitAreaShapes, position } = props
  const structure: Structure = 'tavern'
  const filters = props.selected === true ? [STRUCTURE_HIGHLIGHT_FILTER] : []

  return (
    <Container position={position}>
      <Sprite
        name={structure}
        eventMode='static'
        pointerdown={() => { props.onStructureClick(structure) }}
        filters={filters}
        hitArea={hitAreaShapes}
        image={sprites.TOWN_STRUCTURE_TAVERN}
      />
      <ParticleEmitter
        name="smoke"
        x={107}
        y={-2}
        image={sprites.TOWN_EFFECT_SMOKEPARTICLE}
        config={smoke}
      />
    </Container>
  )
}
export default Tavern
