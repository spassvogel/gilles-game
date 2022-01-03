import { useCallback, useEffect, useRef } from "react";

// Will resize ref based on a 'canvas' tag thats next to the ref
// Returns the scale level (1 = full scale, 0.5 half scale)
const useCanvasScaler = (ref: React.RefObject<HTMLDivElement>, sceneWidth: number, sceneHeight: number) => {
  const scale = useRef(1);

  const handleResize = useCallback(() => {
    if (!ref.current) return 1;
    const canvas = ref.current.parentNode?.querySelector("canvas");
    if (!canvas) throw Error(`No canvas found as sibling of ${ref.current}`);

    const currentWidth = canvas?.clientWidth;
    scale.current = currentWidth/sceneWidth;
    ref.current.style.transform = `scale(${scale.current})`;
    ref.current.style.width = `${sceneWidth}px`;
    ref.current.style.height = `${sceneHeight}px`;
    return scale.current;

  }, [ref, sceneHeight, sceneWidth]);

  useEffect(() => {
    // Scale the html element together with the sibling canvas
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, ref, sceneHeight, sceneWidth]);

  return { scale: scale.current, recalculate: handleResize };
}

export default useCanvasScaler;
