import { hasOwnProperty } from "./typescript";

export type MouseOrTouchEvent<T = HTMLElement> = React.MouseEvent<T> | React.TouchEvent<T>

// Normalizes `clientX` and `clientY` props from either a mouse or a touch event
export const convertMouseOrTouchCoords = (e: MouseOrTouchEvent) => {
  if (hasOwnProperty(e, 'clientX') && hasOwnProperty(e, 'clientY')){
    return { x: e.clientX, y: e.clientY };
  }
  if (hasOwnProperty(e, 'touches')) {
    const touch = e.touches[0];
    if (touch) {
      return { x: touch.clientX, y: touch.clientY };
    }
  }
  return { x: NaN, y: NaN };
}

