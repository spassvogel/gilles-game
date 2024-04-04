import { Container } from '@pixi/react'
import { useRef } from 'react'
import { type AdventurerObject } from 'store/types/scene'
import SceneActor, { type Props as SceneActorProps } from './SceneActor'
import { Assets, type Container as PixiContainer } from 'pixi.js'
import { useAdventurer } from 'hooks/store/adventurers'
import determineActorZ from './utils/determineActorZ'
import { defineAssetPath } from 'utils/assets'
import { sprites } from 'bundles/sprites'

type Props = {
  actor: AdventurerObject
  selected: boolean
}

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children' | 'name' | 'health' | 'spritesheet'>) => {
  const {
    controller,
    location,
    actor,
    selected
  } = props

  const ref = useRef<PixiContainer>(null)
  const adventurer = useAdventurer(actor.adventurerId)
  const { health, spritesheet: key } = adventurer
  const path = defineAssetPath(sprites.actors[key])
  const spritesheet = Assets.get(path)
  if (spritesheet === undefined) return null

  const name = `${actor.adventurerId} - ${adventurer.name}${health <= 0 ? ' (✝)' : ''}`
  return (
    <Container ref={ref} zIndex={determineActorZ(location, health)} name={name} sortableChildren={true}>
      <SceneActor
        actor={actor}
        health={adventurer.health}
        controller={controller}
        spritesheet={spritesheet}
        location={location}
        selectionColor={selected ? 0xffffff : undefined }
        idleAnimation={Math.random() < 0.5}
      />
    </Container>
  )
}

export default SceneAdventurer
