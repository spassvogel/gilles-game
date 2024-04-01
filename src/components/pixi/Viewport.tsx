import React, { type PropsWithChildren, forwardRef } from 'react'
import type * as PIXI from 'pixi.js'
import { PixiComponent, useApp } from '@pixi/react'
import { Viewport as PixiViewport } from 'pixi-viewport'
import { EventSystem } from '@pixi/events'
import { type Container as PixiContainer } from '@pixi/display'

export type ViewportProps = PropsWithChildren<{
  screenWidth: number
  screenHeight: number
  worldWidth: number
  worldHeight: number
  minScale?: number
  maxScale?: number
}>

export type PixiComponentViewportProps = {
  app: PIXI.Application
} & ViewportProps

const PixiComponentViewport = PixiComponent('Viewport', {
  create: (props: PixiComponentViewportProps) => {
    const {
      screenWidth,
      screenHeight,
      worldWidth,
      worldHeight,
      minScale = 1,
      maxScale = 2
    } = props

    // comes from github issue: https://github.com/davidfig/pixi-viewport/issues/438
    // Install EventSystem, if not already
    // (PixiJS 6 doesn't add it by default)
    const events = new EventSystem(props.app.renderer)
    events.domElement = props.app.renderer.view as unknown as HTMLElement

    const viewport = new PixiViewport({
      screenWidth,
      screenHeight,
      worldWidth,
      worldHeight,
      ticker: props.app.ticker,
      events
    })
    viewport
      .drag()
      .pinch()
      .wheel()
      .clamp({ direction: 'all' })
      .clampZoom({
        minScale,
        maxScale
      })
      .decelerate()

    return viewport
  },

  willUnmount: (instance: PixiViewport, _parent: PixiContainer) => {
    // workaround because the ticker is already destroyed by this point by the stage
    instance.options.noTicker = true
    instance.destroy({ children: true, texture: true, baseTexture: true })
  }
})

const Viewport = forwardRef(
  (props: ViewportProps, ref: React.Ref<PixiViewport>) => {
    const app = useApp()
    // Perhaps this is better moved somewhere else
    window.__PIXI_APP__ = app

    const cursor = 'var(--cursor-pointer);'
    app.renderer.events.cursorStyles.pointer = cursor

    return <PixiComponentViewport ref={ref} app={app} {...props} />
  }
)

export default Viewport
