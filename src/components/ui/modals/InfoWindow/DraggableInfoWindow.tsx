import ReactDOM from "react-dom";
import useDraggable from "hooks/store/useDraggable";
import { ComponentProps, ReactNode, useEffect, useRef } from "react";

export interface Props {
  title?: ReactNode;
}
// An InfoWindow is a semi transparant black square. It is used for tooltips
// and InfoModal. This can be dragged anywhere on the screen
export const DraggableInfoWindow = (props: ComponentProps<"div">) => {
  const { className, title, children, ...otherProps } = props;

  const ref = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLHeadingElement>(null);
  useDraggable(ref, handle);
  useEffect(() => {
    // center window
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const parentRect = (ref.current.parentNode as HTMLElement).getBoundingClientRect();
      ref.current.style.left = `${parentRect.width / 2 - rect.width / 2}px`;
      ref.current.style.top = `${parentRect.height / 2 - rect.height / 2}px`;
    }
  }, []);

  return ReactDOM.createPortal(
    <div {...otherProps} ref={ref} draggable className={`info-window info-window-draggable ${className || ""}`} >
      <h2 className="title" ref={handle}>
        {title}
      </h2>
      {children}
    </div>,
    document.body
  )
}
