import { Container } from '@pixi/react'
import { type Container as PixiContainer } from 'pixi.js'
import { isAdventurer, isEnemy, type SceneObject } from 'store/types/scene'
import SceneAdventurer from '../SceneAdventurer'
import { type BaseSceneController } from 'mechanics/scenes/BaseSceneController'
import { TiledObjectType } from 'utils/tilemap'
import SceneEnemy from '../SceneEnemy'
import { useRef } from 'react'

type Props = {
  objects: SceneObject[]
  controller: BaseSceneController<unknown>
  selectedActorId: string
}

const ObjectSpriteLayer = (props: Props) => {
  const { objects, controller } = props
  const ref = useRef<PixiContainer>(null)

  return (
    <Container sortableChildren ref={ref} name="ObjectSpriteLayer">
      {objects.map((object) => {
        const { location } = object
        const { adventurerId } = object.properties as Record<string, string>

        switch (object.type) {
          case TiledObjectType.actor: {
            if (isAdventurer(object)) {
              return (
                <SceneAdventurer
                  location={location}
                  controller={controller}
                  actor={object}
                  key={adventurerId}
                  selected={props.selectedActorId === object.adventurerId }
                />
              )
            } else if (isEnemy(object)) {
              return (
                <SceneEnemy
                  actor={object}
                  controller={controller}
                  location={location}
                  key={object.enemyId}
                  idleAnimation={Math.random() < 0.5}
                  lookAt={[4, 3]}
                  selected={props.selectedActorId === object.enemyId }
                />
              )
            }
            break
          }
          default:
            return null
        }
        return null
      })}
    </Container>
  )
}

export default ObjectSpriteLayer
