import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import React, { PropsWithChildren, useContext, useEffect, useRef } from 'react';
import "./styles/sceneUI.scss";

export interface Props {
}

// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
    const {children} = props;
    const ref = useRef<HTMLDivElement>(null);
    const scale = useRef(1);
    const controller = useContext(SceneControllerContext)!;

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            const canvas = ref.current.parentNode?.querySelector("canvas");
            if (!canvas) return;

            const originalWidth = parseInt(canvas?.getAttribute("width") || "0");
            const originalHeight = parseInt(canvas?.getAttribute("height") || "0");
            const currentWidth = canvas?.clientWidth;
            scale.current = currentWidth/originalWidth;
            ref.current.style.transform = `scale(${scale.current})`;
            ref.current.style.width = `${originalWidth}px`;
            ref.current.style.height = `${originalHeight}px`;
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        var rect = (e.target as any).getBoundingClientRect();
        var x = (e.clientX - rect.left) / scale.current; 
        var y = (e.clientY - rect.top) / scale.current; 
        const location = controller.pointToSceneLocation(new PIXI.Point(x, y));
        console.log(location);
        //console.log("Left? : " + x + " ; Top? : " + y + ".");
    }

    return (
        <div ref={ref} className="scene-ui" onMouseMove={handleMove} >
            {children}
        </div>
    )
}

export default SceneUI;