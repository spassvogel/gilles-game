import React, { PropsWithChildren, useContext, useEffect, useRef } from 'react';
import "./styles/sceneUI.scss";

export interface Props {
}

// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
    const {children} = props;
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            const canvas = ref.current.parentNode?.querySelector("canvas");
            if (!canvas) return;

            const originalWidth = parseInt(canvas?.getAttribute("width") || "0");
            const originalHeight = parseInt(canvas?.getAttribute("height") || "0");
            const currentWidth = canvas?.clientWidth;
            ref.current.style.transform = `scale(${currentWidth/originalWidth})`;
            ref.current.style.width = `${originalWidth}px`;
            ref.current.style.height = `${originalHeight}px`;
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div ref={ref} className="scene-ui" >
            {children}
        </div>
    )
}

export default SceneUI;