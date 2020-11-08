import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import useQuest from 'hooks/store/useQuest';
import React, { PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import NormalUICursor from './NormalUICursor';
import "./styles/sceneUI.scss";

export interface Props {
    sceneWidth: number;
    sceneHeight: number;
    selectedActorId: string;

    onMouseDown?: (location: [number, number]) => void;
    onSetPath?: (path: number[][] | undefined) => void;
}

// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
    const {
        children,
        selectedActorId,
        sceneWidth,
        sceneHeight,
        onMouseDown,
        onSetPath
    } = props;
    const ref = useRef<HTMLDivElement>(null);
    const mouseDown = useRef(false);
    const scale = useRef(1);
    const controller = useContext(SceneControllerContext)!;
    const quest = useQuest(controller.questName);
    const scene = quest.scene!;
    const [cursorLocation, setCursorLocation] = useState<[number, number]>();

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

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mouseDown.current) {
            const location = findLocation(e);

            if (controller.locationIsOutOfBounds(location)) {
                setCursorLocation(undefined);
                onSetPath?.(undefined);
                return;
            }
            if (!cursorLocation || !locationEquals(location, cursorLocation)){
                setCursorLocation(location);
                const selectedActorLocation = controller.getActorByAdventurerId(selectedActorId)!.location;
                const path = controller.findPath(selectedActorLocation!, location);
                onSetPath?.(path);
            }
            // console.log(e.currentTarget, e.clientX, location);
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const location = findLocation(e);
        onMouseDown?.(location);
        mouseDown.current = true;
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseDown.current = false;

        const selectedActorLocation = controller.getActorByAdventurerId(selectedActorId)!.location;
        if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation)){
            controller.actorAttemptAction(selectedActorId, SceneActionType.move, cursorLocation);
        }


        setCursorLocation(undefined);
        onSetPath?.(undefined);

    }

    const findLocation = (e: React.MouseEvent) => {
        if (e.target instanceof Element){
            const rect = (e.target).getBoundingClientRect();
            const x = (e.clientX - rect.left) / scale.current;
            const y = (e.clientY - rect.top) / scale.current;
            return controller.pointToSceneLocation(new PIXI.Point(x, y));
        }
        throw new Error("You didnt give me the correct event")
    }

    return (
        <div
            ref={ref}
            className="scene-ui"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            {children}
            {!scene.combat && cursorLocation && (
                <NormalUICursor location={cursorLocation} />
            )}
        </div>
    )
}

export default SceneUI;