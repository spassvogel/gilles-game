import { type RefObject, useEffect, useRef } from 'react'

const useDraggable = (element: RefObject<HTMLElement>, handle?: RefObject<HTMLElement>, constrain?: ParentNode | HTMLElement) => {
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
    const currentHandle = handle.current
    if (currentHandle == null) {
      return
    }

    // const touchStart = (evt: TouchEvent) => {
    //   offset.current = {
    //     x: el.getBoundingClientRect().left ?? 0,
    //     y: el.getBoundingClientRect().top ?? 0
    //   }
    //   initial.current = {
    //     x: evt.touches[0].clientX - offset.current.x,
    //     y: evt.touches[0].clientY - offset.current.y
    //   }
    //   // if (evt.target === handle?.current) {
    //   active.current = true
    //   // }
    //   evt.preventDefault()
    // }

    const mouseStart = (evt: MouseEvent) => {
      console.log('hi')
      offset.current = {
        x: el.getBoundingClientRect().left ?? 0,
        y: el.getBoundingClientRect().top ?? 0
      }
      const constrainRect = (constrain as HTMLElement)?.getBoundingClientRect() ?? { left: 0, top: 0}
      initial.current = {
        x: evt.clientX - offset.current.x + constrainRect.left,
        y: evt.clientY - offset.current.y + constrainRect.top
      }
      evt.preventDefault()

      // if (evt.target === handle?.current) {
        active.current = true
      // }
    }

    const setPosition = () => {
      if (element.current != null) {
        element.current.style.left = `${(current.current?.x ?? 0)}px`
        element.current.style.top = `${(current.current?.y ?? 0)}px`
      }
    }

    const touchMove = (evt: TouchEvent) => {
      if (active.current) {
        evt.preventDefault()
        current.current = {
          x: evt.touches[0].clientX - (initial.current?.x ?? 0) ,
          y: evt.touches[0].clientY - (initial.current?.y ?? 0)
        }

        offset.current = current.current
        setPosition()
      }
      evt.preventDefault()
    }

    const mouseMove = (evt: MouseEvent) => {
      if (active.current) {
        evt.preventDefault()
        current.current = {
          x: evt.pageX - (initial.current?.x ?? 0),
          y: evt.pageY - (initial.current?.y ?? 0)
        }
        offset.current = current.current
        setPosition()
      }
      // evt.preventDefault()
    }

//     const dragEnd = (evt: TouchEvent) => {
//       // if (initial.current == null) return
// console.log("Drag end")
//       initial.current = current.current
//       active.current = false
//     }
    const mouseEnd = (_evt: MouseEvent) => {
      // if (initial.current == null) return
console.log("Drag end")
      initial.current = current.current
      active.current = false
    }

    // currentHandle.addEventListener('touchstart', touchStart, false)
    // document.addEventListener('touchend', dragEnd, false)
    // document.addEventListener('touchmove', touchMove, false)

    console.log('attaching')
    currentHandle.addEventListener('mousedown', mouseStart)
    // window.addEventListener('mouseup', mouseEnd)
    window.addEventListener('dragend', mouseEnd)
    document.addEventListener('mousemove', mouseMove)

    return () => {
      // currentHandle.removeEventListener('touchstart', touchStart, false)
      // document.removeEventListener('touchend', dragEnd, false)
      // document.removeEventListener('touchmove', touchMove, false)
      // currentHandle.removeEventListener('mousedown', mouseStart, false)
      // window.removeEventListener('mouseup', mouseEnd, false)
      // document.removeEventListener('mousemove', mouseMove, false)
    }
  }, [])
}

export default useDraggable
