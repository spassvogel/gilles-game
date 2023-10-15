import { type RefObject, useEffect, useRef } from 'react'

const useDraggable = (element: RefObject<HTMLElement>, handle?: RefObject<HTMLElement>) => {
  const initial = useRef<{ x: number, y: number }>()
  const offset = useRef<{ x: number, y: number }>({ x: 0, y: 0 })
  const current = useRef<{ x: number, y: number }>()
  const active = useRef(false)

  useEffect(() => {
    const el = element.current
    if (el == null) return
    if (handle == null) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      handle = element
    }

    const touchStart = (evt: TouchEvent) => {
      offset.current = {
        x: el.getBoundingClientRect().left ?? 0,
        y: el.getBoundingClientRect().top ?? 0
      }
      initial.current = {
        x: evt.touches[0].clientX - offset.current.x,
        y: evt.touches[0].clientY - offset.current.y
      }
      if (evt.target === handle?.current) {
        active.current = true
      }
    }

    const mouseStart = (evt: MouseEvent) => {
      offset.current = {
        x: el.getBoundingClientRect().left ?? 0,
        y: el.getBoundingClientRect().top ?? 0
      }
      initial.current = {
        x: evt.clientX - offset.current.x,
        y: evt.clientY - offset.current.y
      }

      if (evt.target === handle?.current) {
        active.current = true
      }
    }

    const setPosition = () => {
      if (element.current != null) {
        element.current.style.left = `${current.current?.x ?? 0}px`
        element.current.style.top = `${current.current?.y ?? 0}px`
      }
    }

    const touchMove = (evt: TouchEvent) => {
      if (active.current) {
        evt.preventDefault()
        current.current = {
          x: evt.touches[0].clientX - (initial.current?.x ?? 0),
          y: evt.touches[0].clientY - (initial.current?.y ?? 0)
        }

        offset.current = current.current
        setPosition()
      }
    }

    const mouseMove = (evt: MouseEvent) => {
      if (active.current) {
        evt.preventDefault()
        current.current = {
          x: evt.clientX - (initial.current?.x ?? 0),
          y: evt.clientY - (initial.current?.y ?? 0)
        }
        offset.current = current.current
        setPosition()
      }
    }

    const dragEnd = () => {
      if (initial.current == null) return

      initial.current = current.current
      active.current = false
    }

    el.addEventListener('touchstart', touchStart, false)
    document.addEventListener('touchend', dragEnd, false)
    document.addEventListener('touchmove', touchMove, false)

    el.addEventListener('mousedown', mouseStart, false)
    document.addEventListener('mouseup', dragEnd, false)
    document.addEventListener('mousemove', mouseMove, false)

    return () => {
      el.removeEventListener('touchstart', touchStart, false)
      document.removeEventListener('touchend', dragEnd, false)
      document.removeEventListener('touchend', dragEnd, false)
      document.removeEventListener('touchmove', touchMove, false)

      el.removeEventListener('mousedown', mouseStart, false)
      document.removeEventListener('mouseup', dragEnd, false)
      document.removeEventListener('mousemove', mouseMove, false)
    }
  }, [])
}

export default useDraggable
