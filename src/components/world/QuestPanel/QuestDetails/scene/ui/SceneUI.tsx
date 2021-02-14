import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { useQuest } from 'hooks/store/quests';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import ActorThingy from './ActorThingy';
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
    action: SceneActionType.move | SceneActionType.slash | SceneActionType.interact;
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
    const {combat} = scene;
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
        e.preventDefault();
    }

    const handleMouseUp = (_e: React.MouseEvent<HTMLDivElement>) => {
        mouseDown.current = false;

        setCursorLocation(undefined); // todo: uncomment to debug
        if (!actionIntent) {
            return
        }
        const selectedActorLocation = controller.getSceneActor(selectedActorId)!.location;
        if (selectedActorLocation && cursorLocation && !locationEquals(selectedActorLocation, cursorLocation)){
            controller.actorAttemptAction(selectedActorId, actionIntent.action, actionIntent.to);
        }
        onSetActionIntent?.(undefined);
    }

    const handleCombatActionChange = useCallback((action?: SceneActionType) => { // todo: beter name, not just combat
        if (!action) {
            onSetActionIntent(undefined);
            return;
        }
        const {
            location: from = [0, 0],
            ap: actorAP,
        } = controller.getSceneActor(selectedActorId)!;
        const to = cursorLocation!;

        switch (action){
            case SceneActionType.move:
            case SceneActionType.slash: {
                const path = controller.findPath(from, to);
                const apCost = combat ? controller.calculateWalkApCosts(from, to) : undefined;
                onSetActionIntent({
                    action,
                    from,
                    to,
                    apCost,
                    actorAP,
                    path,
                })
            }
            break;
            case SceneActionType.interact: {
                const path = controller.findPathNearest(from, to, true);
                const apCost = 0; // can only inspect out of combat?
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
    }, [combat, controller, cursorLocation, onSetActionIntent, selectedActorId]);

    useEffect(() => {
        if (!combat && cursorLocation !== undefined) {
            // Handle change of cursor when not in combat
            let action = SceneActionType.move;
            const object = controller.getObjectAtLocation(cursorLocation);
            if(object?.properties.interactive){
                // We're at an interactive object
                action = SceneActionType.interact;
            }
            handleCombatActionChange(action);
        }
    }, [cursorLocation, handleCombatActionChange, combat, controller])


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
            {scene.combat && controller.sceneActors.map(a => (
                <ActorThingy key={a.id} actor={a} />
            ))}
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