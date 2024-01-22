import { useEffect, useRef, useCallback, useState, type RefObject } from 'react'
import { Stage, Sprite } from '@pixi/react'
import { type Viewport as PixiViewport } from 'pixi-viewport'
import { useSelector } from 'react-redux'
import { type QuestStoreState } from 'store/types/quest'
import { type QuestDefinition, QuestNodeType, type QuestNode } from 'definitions/quests/types'
import Viewport from '../../pixi/Viewport'
import MapGrid from './MapGrid'
import QuestMarker from './QuestMarker'
import { type AdventurerStoreState } from 'store/types/adventurer'
import QuestLine from './QuestLine'
import { MAX_WIDTH as WIDTH } from 'components/App'
import { getDefinition } from 'definitions/quests'
import * as TextManager from 'global/TextManager'
import { getQuestLeader } from 'store/helpers/storeHelpers'
import { type StoreState } from 'store/types'
import { useActiveQuests } from 'hooks/store/quests'
import { useNavigate } from 'react-router-dom'
import { getWorldLink } from 'utils/routing'
import { DebugToggleCombat } from './DebugToggleCombat'
import {
  FULL_HEIGHT,
  SMALL_HEIGHT,
  nodeLocationToPoint,
  getPreviousPositions,
  getQuestWorldLocation,
  WORLD_WIDTH,
  WORLD_HEIGHT
} from './utils'
import { type IApplicationOptions } from 'pixi.js'
import { sprites } from 'bundles/sprites'
import { useSettings } from 'hooks/store/settings'

import './styles/worldMap.scss'

const GRID_WIDTH = 100
export type Props = {
  selectedQuestName?: string
  smallMap: boolean
  onPartyClick: (questName: string) => void
  retrieveWorldViewRef: () => RefObject<HTMLDivElement>
}

const WorldMap = (props: Props) => {
  const { retrieveWorldViewRef, smallMap } = props
  const questSelector = useCallback(
    (state: StoreState) => state.quests.find((q) => q.name === props.selectedQuestName),
    [props.selectedQuestName]
  )

  const selectedQuest = useSelector<StoreState, QuestStoreState | undefined>(questSelector)
  const adventurers = useSelector<StoreState, AdventurerStoreState[]>((store) => store.adventurers)
  const activeQuests = useActiveQuests()
  const settings = useSettings()
  const navigate = useNavigate()
  const viewportRef = useRef<PixiViewport>(null)

  const handlePartyClick = (name: string) => {
    props.onPartyClick(name)
  }

  const handleClose = () => {
    navigate(getWorldLink())
  }

  // useEffect(() => {
  //   const onScroll = (e: WheelEvent) => {
  //     // When the map is big, scrolling the mouse is just used for zoom, not for actual scrolling
  //     if (!smallMap) {
  //       e.preventDefault()
  //     }
  //   }
  //   window.addEventListener("wheel", onScroll, {passive: false} )
  //   return () => {
  //     window.removeEventListener("wheel", onScroll)
  //   }
  // }, [smallMap])

  const [canvasWidth, setCanvasWidth] = useState(WIDTH)
  const [canvasHeight, setCanvasHeight] = useState(FULL_HEIGHT)

  // puts the given party in the center of the map
  const focusOnQuestingParty = (quest: QuestStoreState) => {
    const viewport = viewportRef.current
    if (viewport !== null) {
      const partyLocation = getQuestWorldLocation(quest)
      const point = nodeLocationToPoint(partyLocation)
      viewport.moveCenter(point.x, point.y)
    }
  }

  useEffect(() => {
    // This will set the dimensions of the canvas tot that of the parent (worldview)
    const resize = () => {
      const worldView = retrieveWorldViewRef()
      const worldViewWidth = worldView.current?.clientWidth ?? WIDTH
      const worldViewHeight = worldView.current?.clientHeight ?? FULL_HEIGHT

      setCanvasWidth(worldViewWidth)
      if (smallMap) {
        if (worldViewWidth < 576) {
          // Small screens
          setCanvasHeight(SMALL_HEIGHT / 2)
        } else {
          setCanvasHeight(SMALL_HEIGHT)
        }
      } else {
        setCanvasHeight(worldViewHeight)
      }

      const viewport = viewportRef.current
      if (viewport != null) {
        viewport.resize(canvasWidth, canvasHeight)
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [canvasHeight, canvasWidth, retrieveWorldViewRef, smallMap])

  useEffect(() => {
    if (selectedQuest != null) {
      focusOnQuestingParty(selectedQuest)
    } else {
      const viewport = viewportRef.current
      const point = nodeLocationToPoint({ x: 0, y: 0 })
      viewport?.moveCenter(point.x, point.y)
    }
  }, [selectedQuest, canvasHeight])

  useEffect(() => {
    // focus on center of the map
    if (viewportRef.current !== null) {
      const viewport = viewportRef.current
      const point = nodeLocationToPoint({ x: 0, y: 0 })
      viewport.moveCenter(point.x / 2, point.y / 2 + 10)
    }
  }, [canvasWidth])

  const renderQuestlines = () => {
    return activeQuests.map((quest) => {
      const previousPositions = getPreviousPositions(quest)
      return (
        <QuestLine positions={previousPositions} key={quest.name} />
      )
    })
  }

  const renderMarkers = () => {
    return activeQuests.map((quest) => {
      const location = getQuestWorldLocation(quest)
      const currentPosition = nodeLocationToPoint(location)
      const leader = getQuestLeader(adventurers, quest) ?? adventurers[0]
      const questDefinition: QuestDefinition = getDefinition(quest.name)
      const progress: number = Math.floor(quest.progress)
      const questNode: QuestNode = questDefinition.nodes[progress]

      return (
        <QuestMarker
          quest={quest}
          leader={leader}
          position={currentPosition}
          key={quest.name}
          selected={quest === selectedQuest}
          encounterActive={questNode.type === QuestNodeType.encounter}
          onClick={(q) => { handlePartyClick(q.name) }}
        />
      )
    })
  }

  const handleMapClick = () => {
    /// todo: close map
    // if(smallMap === true && selectedQuest) {
    //   props.onPartyClick(selectedQuest.name)
    // }
  }

  const options: Partial<IApplicationOptions> = {
    backgroundColor: 0xa09b92,
    autoDensity: true,
    width: canvasWidth,
    height: canvasHeight
  }

  return (
    <div className="world-map">
      <Stage width={canvasWidth} height={canvasHeight} options={options}>
        <Viewport screenWidth={canvasWidth} screenHeight={canvasHeight} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} ref={viewportRef} >
          <Sprite
            image={sprites.WORLD_MAP_DEFAULT}
            eventMode='static'
            pointerdown={handleMapClick}
          >
            {renderQuestlines()}
            {renderMarkers()}
          </Sprite>
          { settings.debugMapShowGrid && <MapGrid width={WORLD_WIDTH} height={WORLD_HEIGHT} gridWidth={GRID_WIDTH} /> }
        </Viewport>
      </Stage>
      {props.selectedQuestName !== undefined && (
        <div className="title">
          <span>
            <DebugToggleCombat questName={props.selectedQuestName} />
            {TextManager.getQuestTitle(props.selectedQuestName)}
            {' | '}
            {selectedQuest?.sceneName != null ? TextManager.getQuestSceneTitle(selectedQuest) : '...'}
          </span>
          <span onClick={handleClose} className="close">╳</span>
        </div>
      )}
    </div>
  )
}

export default WorldMap
