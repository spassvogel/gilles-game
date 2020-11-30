import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import useQuest from 'hooks/store/useQuest';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import CombatUIWidget from './CombatUIWidget';
import NormalUICursor from './NormalUICursor';
import "./styles/sceneUI.scss";

export interface Props {
    sceneWidth: number;
    sceneHeight: number;
    selectedActorId: string;
    actionIntent?: ActionIntent;

    onMouseDown?: (location: [number, number]) => void;
    onSetActionIntent: (intent?: ActionIntent) => void;
}

export interface ActionIntent {
    action: SceneActionType.move | SceneActionType.slash;
    from: [number, number];
    to: [number, number];
    apCost?: number;
    actorAP?: number;
    path?: [number, number][];  // is undefined when path is invalid
}

// This thing scales itself based on the canvas which should be a sibling of this component
const SceneUI = (props: PropsWithChildren<Props>) => {
    const {
        children,
        selectedActorId,
        actionIntent,
        sceneWidth,
        sceneHeight,
        onMouseDown,
        onSetActionIntent
    } = props;
    const ref = useRef<HTMLDivElement>(null);
    const mouseDown = useRef(false);
    const scale = useRef(1);
    const controller = useContext(SceneControllerContext)!;
    const quest = useQuest(controller.questName);
    const scene = quest.scene!;
    const [cursorLocation, setCursorLocation] = useState<[number, number]>();

    useEffect(() => {
        // Scale the html element together with the sibling canvas
        const handleResize = () => {
            if (!ref.current) return;
            const canvas = ref.current.parentNode?.querySelector("canvas");
            if (!canvas) throw Error("No canvas found as sibling of SceneUI");

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
                onSetActionIntent(undefined);
                return;
            }
            if (!cursorLocation || !locationEquals(location, cursorLocation)){
                setCursorLocation(location);
            }
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const location = findLocation(e);
        onMouseDown?.(location);
        mouseDown.current = true;
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        mouseDown.current = false;

        // setCursorLocation(undefined); // todo: uncomment to debug
        if (!actionIntent) {
            return
        }
        const selectedActorLocation = controller.getActorByAdventurerId(selectedActorId)!.location;
        if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation)){
            controller.actorAttemptAction(selectedActorId, actionIntent.action, actionIntent.to);
        }
        onSetActionIntent?.(undefined);
    }

    const handleCombatActionChange = useCallback((action?: SceneActionType) => { //todo: beter name, not just combat
        if (!action) {
            onSetActionIntent(undefined);
            return;
        }

        const {
            location: from,
            ap: actorAP,
        } = controller.getActorByAdventurerId(selectedActorId)!;
        const to = cursorLocation!;

        switch (action){
            case SceneActionType.move:
            case SceneActionType.slash: {
                const path = controller.findPath(from, to);
                const apCost = controller.calculateWalkApCosts(from, to);

                onSetActionIntent({
                    action,
                    from,
                    to,
                    apCost,
                    actorAP,
                    path,
                })
            }
        }
    }, [controller, cursorLocation, onSetActionIntent, selectedActorId]);

    useEffect(() => {
        if (!scene.combat && cursorLocation !== undefined) {
            handleCombatActionChange(SceneActionType.move);
        }
    }, [cursorLocation, handleCombatActionChange, scene.combat])


    // const previewAction = (action: SceneActionType | undefined, target: [number, number]) => {

    //     const selectedActorLocation = controller.getActorByAdventurerId(selectedActorId)!.location;

    //     switch (action) {
    //         case SceneActionType.move: {
    //             const path = controller.findPath(selectedActorLocation!, target);
    //             if (!path) return;
    //             const convert = (p: number[]) => new PIXI.Point(p[0] * (tileWidth) + (tileWidth / 2), p[1] * (tileHeight) + (tileHeight / 2));
    //             const start = controller.getActorByAdventurerId(selectedActorId)?.location!;
    //             const converted = [
    //                 convert(start),
    //                 ...path.map(p => convert(p))
    //             ];
    //             onSetMovePath?.(converted);
    //             break;
    //         }

    //         default: {
    //             onSetMovePath?.(undefined);
    //         }
    //     }
    // }

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
            {scene.combat && cursorLocation && (
                <CombatUIWidget
                    location={cursorLocation}
                    actionIntent={actionIntent}
                    onActionChange={handleCombatActionChange}
                />
            )}
        </div>
    )
}

export default SceneUI;