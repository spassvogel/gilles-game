import { useRef, useEffect, type PropsWithChildren, forwardRef, useImperativeHandle } from 'react'
import { Sprite } from '@pixi/react'
import { type Viewport as PixiViewport } from 'pixi-viewport'
import Viewport from 'components/pixi/Viewport'
import { gsap } from 'gsap'
import { GodrayFilter } from '@pixi/filter-godray'
import BridgedStage from 'components/pixi/util/BridgedStage'
import { sprites } from 'bundles/sprites'

export type Props = {
  screenWidth: number
  screenHeight: number
  worldWidth: number
  worldHeight: number
  blockScroll: boolean
}

export const godray = new GodrayFilter()

const options = {
  autoDensity: true,
  sharedLoader: true,
  backgroundColor: 0x99e5f5,
}

const TownStage = forwardRef<PixiViewport, PropsWithChildren<Props>>((props, ref: React.Ref<PixiViewport>) => {
  const {
    children,
    screenWidth,
    screenHeight,
    worldWidth,
    worldHeight,
    blockScroll
  } = props

  const innerRef = useRef<PixiViewport>(null)

  useImperativeHandle(ref, () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return innerRef.current
  })

  useEffect(() => {
    godray.enabled = false
    if (innerRef.current !== undefined) {
      const viewport = innerRef.current
      // viewport.on('moved', () => {
      //   const horizontalFactor = gsap.utils.normalize(viewport.screenWidth, worldWidth, viewport.right)
      //   const verticalFactor = gsap.utils.normalize(worldHeight, viewport.screenHeight, viewport.bottom)
      //   const factor = Math.max(horizontalFactor * verticalFactor - 0.4, 0)

      //   godray.gain = factor
      //   godray.lacunarity = 2.4
      //   godray.enabled = godray.gain > 0
      // })
    }

    const onScroll = (e: WheelEvent) => {
      // Scrolling the mouse is just used for zoom, not for actual scrolling
      e.preventDefault()
    }

    if (blockScroll) {
      window.addEventListener('wheel', onScroll, { passive: false })
    }
    return () => {
      window.removeEventListener('wheel', onScroll)
    }
  }, [blockScroll, worldHeight, worldWidth])

  return (
    <BridgedStage width={screenWidth} height={screenHeight} options={options} >
      <Viewport
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        worldWidth={worldWidth}
        worldHeight={worldHeight}
        ref={innerRef}>
        <Sprite
          name="background"
          image={sprites.TOWN_BACKGROUND}
          filters={[godray]}
        >
          {children}
          </Sprite>
      </Viewport>
    </BridgedStage>

  )
})
TownStage.displayName = 'TownStage'

export default TownStage
