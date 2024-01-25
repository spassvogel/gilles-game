import SpriteAnimated from 'components/pixi/tile/SpriteAnimated'
import { Graphics, Stage, Text } from '@pixi/react'
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor'
import useFrames from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useFrames'
import { SPRITE_WIDTH } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/utils'
import { type Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation'
import { useEffect, useRef, useState } from 'react'
import { TextStyle, type AnimatedSprite, type Spritesheet } from 'pixi.js'

type Props = {
  spritesheet: Spritesheet
  animation: Animation
  orientation: Orientation
  currentFrame?: number
  bgColor: string
}

const DebugSpriteDemo = (props: Props) => {
  const { spritesheet, animation, orientation, currentFrame, bgColor } = props
  const ref = useRef<AnimatedSprite>(null)
  const frames = useFrames(spritesheet, animation, orientation)
  const [flipped, setFlipped] = useState(false)
  const [frame, setFrame] = useState<number>(0)

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest)
  }, [orientation])

  useEffect(() => {
    if (currentFrame != null) {
      const frame = currentFrame % (ref.current?.totalFrames ?? 1)
      ref.current?.gotoAndStop(frame)
    }
  }, [currentFrame])

  useEffect(() => {
    if (ref.current == null) {
      return
    }

    const listener = () => {
      const frame = ref.current?.currentFrame ?? 0
      setFrame(frame)
    }
    ref.current.onFrameChange = listener
    return () => {
    }
  }, [])

  return (
    <Stage width={SPRITE_WIDTH * 2} height={SPRITE_WIDTH * 2}>
      <Graphics
        name="background"
        draw={graphics => {
          graphics.beginFill(bgColor)
          graphics.drawRect(0, 0, SPRITE_WIDTH * 2, SPRITE_WIDTH * 2)
        }}
      />
      <Graphics
        name="border"
        draw={graphics => {
          // graphics.setst(bgColor)
          graphics.lineStyle(1, '#fff')
          graphics.drawRect(SPRITE_WIDTH / 2, SPRITE_WIDTH / 2, SPRITE_WIDTH, SPRITE_WIDTH)
        }}
      />
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
      <Text
        x={SPRITE_WIDTH * 2 - 10}
        anchor={[1, 0]}
        text={`${frame}`}
        style={style}
        />
    </Stage>
  )
}
const style = new TextStyle({
  fontFamily: 'Gabriela',
  fontSize: 25,
  fill: 0xffffff,
  wordWrap: true,
  wordWrapWidth: 200,
  dropShadow: true,
  dropShadowAngle: 0.9,
  dropShadowBlur: 2,
  dropShadowDistance: 0
})
export default DebugSpriteDemo
