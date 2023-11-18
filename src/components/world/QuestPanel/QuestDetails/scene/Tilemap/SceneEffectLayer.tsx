import { Container } from '@pixi/react'
import { type BaseSceneController, EVENT_SCENE_EFFECT } from 'mechanics/scenes/BaseSceneController'
import { useEffect, useRef } from 'react'
import { AnimatedSprite, Assets, type Container as PixiContainer, type Point } from 'pixi.js'

type Props = {
  controller: BaseSceneController<unknown>
}

const SceneEffectLayer = (props: Props) => {
  const { controller } = props

  const ref = useRef<PixiContainer>(null)
  useEffect(() => {
    const addEffect = (path: string, point: Point) => {
      const sheet = Assets.get(path)
      if (sheet?.animations === undefined) {
        throw new Error(`No effect ${path} found!`)
      }
      const animatedSprite = new AnimatedSprite(sheet.animations.play)
      animatedSprite.x = point.x
      animatedSprite.y = point.y
      animatedSprite.animationSpeed = sheet.data.meta.speed
      animatedSprite.loop = false
      animatedSprite.onComplete = () => {
        animatedSprite.destroy()
      }
      animatedSprite.gotoAndPlay(0)
      ref.current?.addChild(animatedSprite)
    }
    controller?.addListener(EVENT_SCENE_EFFECT, addEffect)
    return () => {
      controller.removeListener(EVENT_SCENE_EFFECT, addEffect)
    }
  }, [controller])

  return (
    <Container name="SceneEffectLayer" ref={ref}>

    </Container>
  )
}

export default SceneEffectLayer
