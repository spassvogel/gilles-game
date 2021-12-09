import { RefObject, useEffect, useRef } from "react";

const useDraggable = (element: RefObject<HTMLElement>, handle?: RefObject<HTMLElement>) => {
  const initial = useRef<{x: number, y: number}>();
  const offset = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const current = useRef<{x: number, y: number}>();
  const active = useRef(false)

  useEffect(() => {
    if (!element.current) return;
    if (!handle) {
      handle = element;
    }

    const touchStart = (evt: TouchEvent) => {
      offset.current = {
        x: element.current?.getBoundingClientRect().left ?? 0,
        y: element.current?.getBoundingClientRect().top ?? 0,
      }
      initial.current = {
        x: evt.touches[0].clientX - offset.current.x,
        y: evt.touches[0].clientY - offset.current.y
      }
      if (evt.target === handle?.current) {
        active.current = true;
      }
    }

    const mouseStart = (evt: MouseEvent) => {
      offset.current = {
        x: element.current?.getBoundingClientRect().left ?? 0,
        y: element.current?.getBoundingClientRect().top ?? 0,
      }
      initial.current = {
        x: evt.clientX - offset.current.x,
        y: evt.clientY - offset.current.y
      }

      if (evt.target === handle?.current) {
        active.current = true;
      }
    }

    const touchMove = (evt: TouchEvent) => {
      if (active.current) {

        evt.preventDefault();
        current.current = {
          x: evt.touches[0].clientX - (initial.current?.x ?? 0),
          y: evt.touches[0].clientY - (initial.current?.y ?? 0)
        }

        offset.current = current.current;
        setPosition();
      }
    }

    const mouseMove = (evt: MouseEvent) => {
      if (active.current) {

        evt.preventDefault();
        current.current = {
          x: evt.clientX - (initial.current?.x ?? 0),
          y: evt.clientY - (initial.current?.y ?? 0)
        }
        offset.current = current.current;
        setPosition();
      }
    }


    const dragEnd = () => {
      if (!initial.current) return;

      initial.current = current.current;
      active.current = false;
    }

    const setPosition = () => {
      if (element.current) {
        element.current.style.left = `${current.current?.x ?? 0}px`;
        element.current.style.top = `${current.current?.y ?? 0}px`;
      }
    }
    element.current?.addEventListener("touchstart", touchStart, false);
    element.current?.addEventListener("touchend", dragEnd, false);
    document.addEventListener("touchmove", touchMove, false);

    element.current?.addEventListener("mousedown", mouseStart, false);
    element.current?.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", mouseMove, false);

    return () => {
      element.current?.removeEventListener("touchstart", touchStart, false);
      element.current?.removeEventListener("touchend", dragEnd, false);
      document.removeEventListener("touchmove", touchMove, false);

      element.current?.removeEventListener("mousedown", mouseStart, false);
      element.current?.removeEventListener("mouseup", dragEnd, false);
      document.removeEventListener("mousemove", mouseMove, false);
    }
  }, [])
}

export default useDraggable;
