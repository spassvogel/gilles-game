import { hasOwnProperty } from './typescript'

export type MouseOrTouchEvent<T = HTMLElement> = React.MouseEvent<T> | React.TouchEvent<T> | MouseEvent

// Normalizes `clientX` and `clientY` props from either a mouse or a touch event
export const convertMouseOrTouchCoords = (e: MouseOrTouchEvent) => {
  if (((e as React.MouseEvent).clientX !== 0) && ((e as React.MouseEvent).clientY !== 0)) {
    return {
      x: (e as React.MouseEvent).clientX,
      y: (e as React.MouseEvent).clientY
    }
  }
  if (hasOwnProperty(e, 'touches')) {
    const touch = (e as React.TouchEvent).touches[0]
    return { x: touch.clientX, y: touch.clientY }
  }
  return { x: NaN, y: NaN }
}
