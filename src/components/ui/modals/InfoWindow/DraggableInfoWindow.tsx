import { ComponentProps, ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

export interface Props {
  title?: ReactNode;
}
// An InfoWindow is a semi transparant black square. It is used for tooltips
// and InfoModal
export const DraggableInfoWindow = (props: ComponentProps<"div">) => {
  const { className, title, children, ...otherProps } = props;


  const ref = useRef<HTMLDivElement>(null);
  const initial = useRef<{x: number, y: number}>();
  const offset = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  const current = useRef<{x: number, y: number}>();
  const active = useRef(false)

  useEffect(() => {
    const titleEl = ref.current?.querySelector(".title");
    if (!titleEl) return;

    const touchStart = (evt: TouchEvent) => {
      offset.current = {
        x: ref.current?.getBoundingClientRect().left ?? 0,
        y: ref.current?.getBoundingClientRect().top ?? 0,
      }
      initial.current = {
        x: evt.touches[0].clientX - offset.current.x,
        y: evt.touches[0].clientY - offset.current.y
      }

      if (evt.target === titleEl) {
        active.current = true;
      }
    }

    const mouseStart = (evt: MouseEvent) => {
      offset.current = {
        x: ref.current?.getBoundingClientRect().left ?? 0,
        y: ref.current?.getBoundingClientRect().top ?? 0,
      }
      initial.current = {
        x: evt.clientX - offset.current.x,
        y: evt.clientY - offset.current.y
      }

      if (evt.target === titleEl) {
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
      if (ref.current) {
        ref.current.style.left = `${current.current?.x ?? 0}px`;
        ref.current.style.top = `${current.current?.y ?? 0}px`;
      }
    }
    ref.current?.addEventListener("touchstart", touchStart, false);
    ref.current?.addEventListener("touchend", dragEnd, false);
    document.addEventListener("touchmove", touchMove, false);

    ref.current?.addEventListener("mousedown", mouseStart, false);
    ref.current?.addEventListener("mouseup", dragEnd, false);
    document.addEventListener("mousemove", mouseMove, false);

  }, [])


  return ReactDOM.createPortal(
    <div {...otherProps} ref={ref} draggable className={`info-window info-window-draggable ${className || ""}`} style={{ position: 'absolute', top: "50%", left: "50%" }}>
      <h2 className="title">
        {title}
      </h2>
      {children}
    </div>,
    document.body
  )
}
