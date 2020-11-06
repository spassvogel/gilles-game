import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import React, { PropsWithChildren, useContext, useEffect, useRef } from 'react';
import "./styles/sceneUI.scss";

export interface Props {
    sceneWidth: number;
    sceneHeight: number;
}

// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
    const {children, sceneWidth, sceneHeight } = props;
    const ref = useRef<HTMLDivElement>(null);
    const scale = useRef(1);
    const controller = useContext(SceneControllerContext)!;

    useEffect(() => {
        const handleResize = () => {
            if (!ref.current) return;
            const canvas = ref.current.parentNode?.querySelector("canvas");
            if (!canvas) return;

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
    }, [sceneHeight, sceneWidth]);

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