import { useEffect, useRef } from 'react'
import {
  type BubbleLayer,
  BubbleEmitter,
  BubbleType,
  EVENT_BUBBLE_ADDED
} from 'emitters/BubbleEmitter'
import { type Point } from 'pixi.js'

import './styles/bubbles.scss'

type Props = {
  layer: BubbleLayer
}

const BUBBLE_TIMEOUT = 2000

// Bubbles can be added by calling BubbleManager.addBubble
// BubbleManager will inform whenever the something is added
// The bubbles themselves will fade out via css transition
const Bubbles = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const timeouts = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    const bubbleAdded = (text: string, point: Point, type?: BubbleType, layer?: BubbleLayer) => {
      if (layer === props.layer) {
        const bubble = document.createElement('div')
        bubble.innerHTML = `${text}`
        bubble.className = `bubble${type !== undefined && ` type-${BubbleType[type]}`}`
        bubble.style.left = `${point.x}px`
        bubble.style.top = `${point.y}px`
        ref.current?.appendChild(bubble)

        const timeout = setTimeout(() => {
          timeouts.current = timeouts.current.filter((t: NodeJS.Timeout) => t !== timeout)
          ref.current?.removeChild(bubble)
        }, BUBBLE_TIMEOUT)
        // Keep track of running timeouts in case this component gets unmounted
        timeouts.current.push(timeout)
      }
    }

    BubbleEmitter.instance.addListener(EVENT_BUBBLE_ADDED, bubbleAdded)
    return () => {
      BubbleEmitter.instance.removeListener(EVENT_BUBBLE_ADDED, bubbleAdded)
    }
  }, [props.layer])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(t => { clearTimeout(t) })
    }
  }, [])

  return (
    <div className="bubbles" ref={ref} />
  )
}

export default Bubbles
