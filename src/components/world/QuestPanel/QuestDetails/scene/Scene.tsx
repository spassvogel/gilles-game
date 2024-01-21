import { useRef, useEffect, useContext, useState } from 'react'
import { Container } from '@pixi/react'
import { type Container as PixiContainer } from '@pixi/display'
import { useQuestScene } from 'hooks/store/quests'
import { type Location } from 'utils/tilemap'
import Tilemap from './Tilemap'
import BridgedStage from 'components/pixi/util/BridgedStage'
import useTilesetsLoader from 'hooks/scene/useTilesetsLoader'
import { SceneControllerContext } from '../../context/SceneControllerContext'
import SceneUI, { type ActionIntent } from './ui/SceneUI'
import ActionPreview from './ActionPreview'
import { getUniqueName, isAdventurer, isEnemy, type SceneObject } from 'store/types/scene'
import SceneLog from './SceneLog'
import { CombatController } from 'mechanics/scenes/CombatController'
import { Rectangle } from 'pixi.js'
import { useSettings } from 'hooks/store/settings'
import SceneDebug from './SceneDebug'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { useAdventurers } from 'hooks/store/adventurers'
import { newShaker } from 'pixi/shakeFactory'

import './styles/scene.scss'

export type Props = {
  selectedActorId: string
  setSelectedActor: (id: string) => void
}

/**
 * There is an order of precedence with regards to clicking on objects on the scene.
 * Live adventurers get precedence, then enemies, then dead adventurers. then the rest
 * @param objects
 */

const determineActorToClick = (objects: SceneObject[] = [], adventurers: AdventurerStoreState[] = []) => {
  const sortIndex = (object: SceneObject) => {
    if (isAdventurer(object)) {
      const adventurer = adventurers.find(a => a.id === getUniqueName(object))
      if ((adventurer != null) && adventurer.health > 0) {
        return 100
      }
      return 80
    }
    if (isEnemy(object)) {
      return 90
    }
    return 80
  }
  const order = objects.sort((o1, o2) => (sortIndex(o2) - sortIndex(o1)))
  return order[0]
}

const Scene = (props: Props) => {
  const settings = useSettings()
  const { selectedActorId, setSelectedActor } = props
  const controller = useContext(SceneControllerContext)
  if (controller == null) throw new Error('No controller found')
  const mapData = controller.mapData
  const basePath = controller.basePath
  const adventurers = useAdventurers()
  if (basePath === null) throw new Error('No basePath found')

  const {
    loadComplete,
    loadTilesets,
    tileSpritesheets
  } = useTilesetsLoader(basePath)

  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<PixiContainer>(null)
  const scene = useQuestScene(controller.questName)
  const combat = scene?.combat === true
  const { tileWidth, tileHeight } = controller.getTileDimensions()
  const [currentActionIntent, setCurrentActionIntent] = useState<ActionIntent>()

  useEffect(() => {
    if (combat) {
      CombatController.initialize(controller)
    }
    return () => {
      CombatController.destroy()
    }
  }, [combat, controller])

  useEffect(() => {
    if (mapData == null) return
    loadTilesets(mapData.tilesets)
  }, [loadTilesets, mapData])

  useEffect(() => {
    if (containerRef.current === null) return
    const shaker = newShaker({
      target: containerRef.current,
      isBidirectional: true,
      shakeCountMax: 5000,
      shakeAmount: 60,
      shakeDelay: 25
    })
    // shaker.setTarget(containerRef.current)
    // shaker.shake()
    console.log('shake it up!')
  }, [])

  const handleUIMouseDown = (location: Location) => {
    const objects = controller.getObjectsAtLocation(location)
    const actor = determineActorToClick(objects, adventurers)
    if (actor !== undefined) {
      // We can click on adventurers or enemies
      props.setSelectedActor(getUniqueName(actor))
    }
  }

  if (!loadComplete || (mapData == null) || (scene == null)) {
    return <div>loading scene...</div>
  }

  const sceneWidth = mapData.width * mapData.tilewidth
  const sceneHeight = mapData.height * mapData.tileheight
  return (
    <div className="scene" ref={ref}>
      <BridgedStage width={sceneWidth} height={sceneHeight}>
        <Container
          eventMode='static'
          hitArea={new Rectangle(0, 0, sceneWidth, sceneHeight)}
          ref={containerRef}
        >
          <Tilemap
            basePath={basePath}
            data={mapData}
            spritesheets={tileSpritesheets}
            objects={scene.objects}
            controller={controller}
            selectedActorId={selectedActorId}
            setSelectedActor={setSelectedActor}
          />
          { (currentActionIntent != null) && (<ActionPreview actionIntent={currentActionIntent} tileWidth={tileWidth} tileHeight={tileHeight}/>)}
          { process.env.NODE_ENV === 'development' && <SceneDebug controller={controller} />}
        </Container>
      </BridgedStage>
      {settings.debugSceneShowActionQueue && (
        <div style={{ position: 'absolute', bottom: 0 }}>
          <h2>ActionQueue</h2>
          <ul>
            {scene.actionQueue?.map((action) => (
              <li key={JSON.stringify(action)}>{JSON.stringify(action)}</li>
            ))}
          </ul>
        </div>
      )}
      <SceneUI
        sceneWidth={sceneWidth}
        sceneHeight={sceneHeight}
        selectedActorId={selectedActorId}
        actionIntent={currentActionIntent}
        onMouseDown={handleUIMouseDown}
        onSetActionIntent={setCurrentActionIntent}
      />
      <SceneLog questId={controller.questName} />
    </div>
  )
}

export default Scene
