import { useEffect, useRef } from "react";

// Will resize ref based on a 'canvas' tag thats next to the ref
// Returns the scale level (1 = full scale, 0.5 half scale)
const useCanvasScaler = (ref: React.RefObject<HTMLDivElement>, sceneWidth: number, sceneHeight: number) => {
  const scale = useRef(1);

  useEffect(() => {
    // Scale the html element together with the sibling canvas
    const handleResize = () => {
      if (!ref.current) return;
      const canvas = ref.current.parentNode?.querySelector("canvas");
      if (!canvas) throw Error(`No canvas found as sibling of ${ref.current}`);

      const currentWidth = canvas?.clientWidth;
      scale.current = currentWidth/sceneWidth;
      ref.current.style.transform = `scale(${scale.current})`;
      ref.current.style.width = `${sceneWidth}px`;
      ref.current.style.height = `${sceneHeight}px`;
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref, sceneHeight, sceneWidth]);

  return scale.current;
}

export default useCanvasScaler;
