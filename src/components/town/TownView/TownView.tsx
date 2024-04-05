import { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { type Structure } from 'definitions/structures'
import { type StructuresStoreState } from 'store/types/structures'
import { SoundManager, Channel, MixMode } from 'global/SoundManager'
import { Route, Routes, useMatch, useNavigate } from 'react-router'
import { OutlineFilter } from '@pixi/filter-outline'
import { getStructureLink, getTownLink } from 'utils/routing'
import { StructureState, type StructureStoreState } from 'store/types/structure'
import { type Viewport as PixiViewport } from 'pixi-viewport'
import { type StoreState } from 'store/types'
import { gsap } from 'gsap'
import { MAX_WIDTH } from 'components/App'
import HitAreaShapes from 'utils/pixiJs/hitAreaShapes'
import polygons from '../hitAreas.json'
import TownStage from '../TownStage'
import Clouds from '../Clouds'
import RoutedStructureDetailsView from '../StructureDetailsView'
import StructureLabels from '../StructureLabels'
import { getStructure, getStructurePosition } from './utils'
import localforage from 'localforage'
import { STORAGE_KEY_SHOW_TOWN_LABELS } from 'constants/storage'
import ShowLabels from './ShowLabels'

import './styles/townView.scss'

const HEIGHT = 1079
const WORLD_WIDTH = 1024
const WORLD_HEIGHT = 1600

export const STRUCTURE_HIGHLIGHT_FILTER = new OutlineFilter(8, 0xffcc00)

const TownView = () => {
  const hightlightMatch = useMatch(`${getTownLink()}/:structure`)
  const viewMatch = useMatch(`${getTownLink()}/:structure/view`)
  const selectedStructure = hightlightMatch?.params.structure
  const ref = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<PixiViewport>(null)
  const dragging = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    void SoundManager.playSound('MUSIC_TOWN', Channel.music, true, MixMode.fade, true)
  }, [])

  useEffect(() => {
    const tween = gsap.to(STRUCTURE_HIGHLIGHT_FILTER, {
      duration: 0.6,
      thickness: 2,
      yoyo: true,
      repeat: -1
    })
    return () => {
      tween.pause(0)
      tween.kill()
    }
  }, [])

  useEffect(() => {
    // if (viewportRef.current !== null) {
    //   const viewport = viewportRef.current
    //   viewport.on('drag-start', (e) => {
    //     dragging.current = true
    //     e.event.stopPropagation()
    //   })
    //   viewport.on('drag-end', () => { dragging.current = false })
    // }
  }, [])

  const handleStructureClick = (structure: Structure | null) => {
    if (!dragging.current && structure !== null) {
      void SoundManager.playSound('UI_BUTTON_CLICK')
      navigate(getStructureLink(structure))
    }
  }

  const structures = useSelector<StoreState, StructuresStoreState>((state: StoreState) => {
    return state.structures
  })

  const renderStructures = () => {
    const orderedStructures: Structure[] = [
      'workshop',
      'quarry',
      'tavern',
      'tannery',
      'alchemist',
      'garden',
      'weaponsmith',
      'armoursmith',
      'warehouse',
      'mine',
      'lumberMill',
      'weaver'
    ]
    return orderedStructures.reverse().map((structure) => {
      const structureStore: StructureStoreState = structures[structure]
      if (structureStore.state === StructureState.NotBuilt) {
        return null
      }
      // todo: refactor into seperate components

      const StructureComponent = getStructure(structure)
      const position = getStructurePosition(structure)
      const hitAreaShapes = new HitAreaShapes(polygons, structure as string)
      return (
        <StructureComponent
          position={position}
          structure={structure}
          hitAreaShapes={hitAreaShapes}
          onStructureClick={handleStructureClick}
          key={structure}
          selected={selectedStructure === structure}
        />
      )
    })
  }

  const [canvasWidth, setCanvasWidth] = useState(MAX_WIDTH)
  const [canvasHeight, setCanvasHeight] = useState(HEIGHT)

  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport == null) {
      return
    }
    if (selectedStructure != null) {
      viewport.zoomPercent(0)
      const position = getStructurePosition(selectedStructure as Structure)
      viewport.moveCenter(position)
    } else {
      viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2)
    }
  }, [canvasHeight, canvasWidth, selectedStructure])

  useEffect(() => {
    // This will set the dimensions of the canvas tot that of the townview
    const resize = () => {
      const worldViewWidth = ref.current?.clientWidth ?? MAX_WIDTH
      const worldViewHeight = ref.current?.clientHeight ?? HEIGHT

      setCanvasWidth(worldViewWidth)
      setCanvasHeight(worldViewHeight)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      window.scrollY = 0
    }
  }, [])

  const [showLabels, setShowLabels] = useState<boolean | null>(null)

  useEffect(() => {
    const update = async () => {
      setShowLabels(await localforage.getItem(STORAGE_KEY_SHOW_TOWN_LABELS) !== false)
    }
    void update()
  }, [])

  useEffect(() => {
    if (showLabels !== null) {
      void localforage.setItem(STORAGE_KEY_SHOW_TOWN_LABELS, showLabels)
    }
  }, [showLabels])

  return (
    <div className="town-view" ref={ref}>
      {/* <Legenda structures={structures} /> */}
      { viewMatch === null && (
        <TownStage
          screenWidth={canvasWidth}
          screenHeight={canvasHeight}
          worldWidth={WORLD_WIDTH}
          worldHeight={WORLD_HEIGHT}
          ref={viewportRef}
          blockScroll={viewMatch === null}
        >
          <Clouds worldWidth={canvasWidth} />
          {renderStructures()}
          {/* <Clouds worldWidth={canvasWidth} /> theres a bug with pixi or react/pixi the clouds block clicking */}
          { showLabels !== false && (
            <StructureLabels
              onStructureClick={handleStructureClick}
            />
          )}
        </TownStage>
      )}
      <Routes>
        <Route path=":structure/view" element={<RoutedStructureDetailsView />} />
        <Route path="*" element={ <ShowLabels showLabels={showLabels !== false} onChange={setShowLabels} /> } />
      </Routes>
    </div>
  )
}

export default TownView
