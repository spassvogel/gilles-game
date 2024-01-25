import {
  useMemo,
  useEffect,
  useRef,
  type PropsWithChildren,
  useState,
  type ComponentProps,
  useCallback
} from 'react'
import { type Location } from 'utils/tilemap'
import { Container, Graphics } from '@pixi/react'
import {
  type Filter,
  type Graphics as PixiGraphics,
  type Container as PixiContainer,
  type Spritesheet
} from 'pixi.js'
import {
  type ActorObject,
  getUniqueName
} from 'store/types/scene'
import SpriteAnimated from 'components/pixi/tile/SpriteAnimated'
import { AdventurerColor } from 'store/types/adventurer'
import { useRandomOrientation } from './useRandomOrientation'
import {
  BLACK,
  BLUES,
  calculateBearing,
  createColorReplaceFilter,
  ORANGE,
  Orientation,
  PURPLE,
  REDS,
  SPRITE_WIDTH,
  TEALS,
  WHITE,
  YELLOW
} from './utils'
import useAnimation from './useAnimation'
import useFrames from './useFrames'
import { useQuest } from 'hooks/store/quests'
import { type BaseSceneController } from 'mechanics/scenes/BaseSceneController'

export type Props = {
  actor: ActorObject
  health: number
  spritesheet: Spritesheet
  color?: AdventurerColor
  controller: BaseSceneController<unknown>
  selectionColor?: number
  location?: Location // tile coordinate space
  lookAt?: Location
  idleAnimation?: boolean // Only when lookAt is undefined, will randomly turn around
}

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneActor = (props: PropsWithChildren<Props> & ComponentProps<typeof Container>) => {
  const {
    location = [0, 0],
    controller,
    health,
    idleAnimation,
    color,
    selectionColor,
    children,
    spritesheet,
    lookAt,
    actor,
    ...rest
  } = props

  const { tileWidth, tileHeight } = controller.getTileDimensions()

  const { x, y } = useMemo(() => {
    return {
      x: location[0] * tileWidth,
      y: location[1] * tileHeight
    }
  }, [location, tileWidth, tileHeight])

  const actorRef = useRef<PixiContainer>(null)

  const [orientation, setOrientation] = useState<Orientation>(Orientation.north)
  const animation = useAnimation(controller, actorRef, getUniqueName(actor), location, health, setOrientation)
  const quest = useQuest(props.controller.questName)
  const combat = quest.scene?.combat ?? false
  useRandomOrientation(idleAnimation !== undefined && (lookAt == null) && health > 0 && !combat, orientation, setOrientation)

  const frames = useFrames(spritesheet, animation, orientation)
  const [flipped, setFlipped] = useState(false)

  const drawCircle = useCallback((graphics: PixiGraphics) => {
    const line = 3
    graphics.lineStyle(line, selectionColor)
    graphics.drawCircle(tileWidth / 2, tileHeight / 2, tileWidth / 2 - line)
    graphics.endFill()
  }, [selectionColor, tileHeight, tileWidth])

  useEffect(() => {
    if (lookAt !== undefined) {
      const bearing = calculateBearing(location, lookAt)
      setOrientation(bearing)
    }
  }, [location, lookAt])

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest)
  }, [orientation])

  const scale = useMemo(() => {
    return [(flipped ? -1 : 1), 1] as [number, number]
  }, [flipped])

  const filters = useMemo<Filter[]>(() => {
    switch (color) {
      case AdventurerColor.black:
        return [createColorReplaceFilter(BLUES, BLACK)]
      case AdventurerColor.orange:
        return [createColorReplaceFilter(BLUES, ORANGE)]
      case AdventurerColor.purple:
        return [createColorReplaceFilter(BLUES, PURPLE)]
      case AdventurerColor.red:
        return [createColorReplaceFilter(BLUES, REDS)]
      case AdventurerColor.teal:
        return [createColorReplaceFilter(BLUES, TEALS)]
      case AdventurerColor.white:
        return [createColorReplaceFilter(BLUES, WHITE)]
      case AdventurerColor.yellow:
        return [createColorReplaceFilter(BLUES, YELLOW)]
      default:
        return []
    }
  }, [color])

  return (
    <Container x={x} y={y} ref={actorRef} {...rest}>
      {selectionColor !== undefined && (
        <Graphics
          name="selectioncircle-back"
          draw={drawCircle}
        />
      )}
      { spritesheet !== undefined && (frames != null) && (
        <SpriteAnimated
          animationSpeed={0.1}
          name={`${actor.id}-sprite`}
          isPlaying={true}
          textures={frames}
          x={SPRITE_WIDTH / 4}
          y={20}
          scale={scale}
          anchor={[0.5, 0.5]}
          pivot={[0, 0]}
          filters={filters}
        />
      )}
      {children}
      {/* {combat && (
        <ActorStats tileWidth={tileWidth} actor={actor} />
      )} */}
      {selectionColor !== undefined && (
        <Graphics
          name="selectioncircle-front"
          alpha={0.25}
          draw={drawCircle}
        />
      )}
    </Container>
  )
}

export default SceneActor
