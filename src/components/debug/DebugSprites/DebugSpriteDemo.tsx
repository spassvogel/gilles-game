import SpriteAnimated from 'components/pixi/tile/SpriteAnimated'
import { Stage } from '@pixi/react'
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor'
import useFrames from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useFrames'
import { SPRITE_WIDTH } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/utils'
import { type Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation'
import { useEffect, useRef, useState } from 'react'
import { type AnimatedSprite, type Spritesheet } from 'pixi.js'

type Props = {
  spritesheet: Spritesheet
  animation: Animation
  orientation: Orientation
  currentFrame?: number
}

const options = {
  autoDensity: true,
  sharedLoader: true
}

const DebugSpriteDemo = (props: Props) => {
  const { spritesheet, animation, orientation, currentFrame } = props
  const ref = useRef<AnimatedSprite>(null)
  const frames = useFrames(spritesheet, animation, orientation)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest)
  }, [orientation])

  useEffect(() => {
    if (currentFrame) {
      ref.current?.gotoAndStop(currentFrame)
    }
  }, [currentFrame])

  return (
    <Stage options={options} width={SPRITE_WIDTH * 2} height={SPRITE_WIDTH * 2}>
      <SpriteAnimated
        animationSpeed={0.1}
        isPlaying={true}
        textures={frames}
        x={SPRITE_WIDTH}
        y={SPRITE_WIDTH}
        scale={[(flipped ? -1 : 1), 1]}
        anchor={[0.5, 0.5]}
        pivot={[0, 0]}
        ref={ref}
      />
    </Stage>
  )
}

export default DebugSpriteDemo
