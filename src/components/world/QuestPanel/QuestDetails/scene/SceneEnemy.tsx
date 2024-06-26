import { Container } from '@pixi/react'
import { Assets } from 'pixi.js'
import { type EnemyObject } from 'store/types/scene'
import SceneActor, { type Props as SceneActorProps } from './SceneActor'
import { getDefinition as getEnemyDefinition } from 'definitions/enemies'
import determineActorZ from './utils/determineActorZ'
import { defineAssetPath } from 'utils/assets'
import { sprites } from 'bundles/sprites'

type Props = {
  actor: EnemyObject
  selected: boolean
}

// The enemy on the scene
const SceneEnemy = (props: Props & Omit<SceneActorProps, 'children' | 'name' | 'health' | 'spritesheet'>) => {
  const {
    controller,
    location,
    actor,
    selected
  } = props
  const definition = getEnemyDefinition(actor.enemyType)
  const key = definition.spritesheet
  const path = defineAssetPath(sprites.actors[key])
  const spritesheet = Assets.get(path)

  if (spritesheet === undefined) {
    console.warn(`No spritesheet found for ${actor.enemyType}`)
    return null
  }

  const name = `${actor.enemyId} ${actor.health <= 0 ? ' (✝)' : ''}`

  return (
    <Container zIndex={determineActorZ(location, actor.health)} name={name} sortableChildren={true}>
      <SceneActor
        actor={actor}
        health={actor.health}
        controller={controller}
        spritesheet={spritesheet}
        selectionColor={selected ? 0x8b0000 : undefined }
        location={location}
      />
    </Container>
  )
}

export default SceneEnemy
