import { type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { TooltipEmitter } from 'emitters/TooltipEmitter'
import { InfoWindow } from 'components/ui/modals/InfoWindow/InfoWindow'
import './styles/tooltip.scss'

const ARROW_SIZE = 8 // warning: sync to tooltip.css var
const PADDING = 8

export type Props = {
  referenceRect: DOMRect // place tooltip in reference to this rect
  placement?: Placement
  className?: string
}

export enum Placement {
  bottom,
  top,
  left,
  right,
}

export const Tooltip = (props: PropsWithChildren<Props>) => {
  const { children, referenceRect } = props
  let { className = '' } = props
  const ref = useRef<HTMLDivElement>(null)
  const [placement, setPlacement] = useState<Placement>(props.placement || Placement.bottom)

  const [containerRect, setContainerRect] = useState<DOMRect>() // This is the

  useEffect(() => {
    // Reposition if needed
    const tooltipElement = ref.current
    if (tooltipElement == null) return
    if ((containerRect == null) || !containerRect) return
    const tooltipRect = tooltipElement.getBoundingClientRect()

    // Flip vertically
    switch (placement) {
      case Placement.top:
        if (tooltipRect.top - tooltipRect.height - ARROW_SIZE - PADDING < containerRect.top) {
          // Too high, place underneath
          setPlacement(Placement.bottom)
          return
        }
        break
      case Placement.bottom:
        if (tooltipRect.top + tooltipRect.height + ARROW_SIZE + PADDING > containerRect.height) {
          // Too low, place top
          setPlacement(Placement.top)
          return
        }
        break
    }
    tooltipElement.style.opacity = '1' // animated through css

    const contentElement = tooltipElement.querySelector('.tooltip-content') as HTMLElement
    if (tooltipRect.left < containerRect.left + PADDING) {
      // Check left bounding edge
      const offset = containerRect.left - tooltipRect.left + PADDING
      contentElement.style.transform = `translateX(${offset}px)`
    } else if (tooltipRect.right > containerRect.right - PADDING) {
      // Check right bounding edge
      const offset = tooltipRect.right - containerRect.right + PADDING
      contentElement.style.transform = `translateX(${-offset}px)`
    } else {
      contentElement.style.transform = ''
    }
  }, [setPlacement, containerRect, placement, referenceRect])

  const resize = () => {
    TooltipEmitter.clear()
  }

  useEffect(() => {
    setContainerRect(ref.current?.closest('.app')?.getBoundingClientRect())

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  let x = 0
  let y = 0

  if (containerRect != null) {
    switch (placement) {
      case Placement.bottom:
        x = referenceRect.left - containerRect.left + referenceRect.width / 2
        y = referenceRect.top - containerRect.top + referenceRect.height
        className += ' tooltip-bottom'
        break
      case Placement.top:
        x = referenceRect.left - containerRect.left + referenceRect.width / 2
        y = referenceRect.top - containerRect.top
        className += ' tooltip-top'
        break
    }
  }

  return (
    <div className={`tooltip ${className}`}
      style={{
        left: x,
        opacity: 0,
        top: y
      }}
      ref={ref}
    >
      <div className="tooltip-arrow" />
      <InfoWindow className="tooltip-content">
        {children}
      </InfoWindow>
    </div>
  )
}

export default Tooltip
