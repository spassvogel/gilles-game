import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import useQuest from 'hooks/store/useQuest';
import { deductActorAp, enqueueSceneAction } from 'store/actions/quests';
import { SceneAction, SceneActionType } from 'store/types/scene';
import { RefActions } from 'components/world/QuestPanel/QuestDetails/scene/ActionPath';
import { RefActionPoints } from 'components/world/QuestPanel/QuestDetails/scene/ActionPoints';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';

const useSceneAdventurerActions = (adventurerId: string, controller: BaseSceneController<any>, actionPathRef: React.RefObject<RefActions>, actionPointsRef: React.RefObject<RefActionPoints>,) => {
    // todo: instead just provide a pixi container to draw on...
    const [actionActive, setActionActive] = useState(false);
    const {tileWidth, tileHeight} = controller.getTileDimensions();
    const scene = useQuest(controller.questName).scene!;
    const {combat} = scene!;
    const actor = controller.getActorByAdventurerId(adventurerId)!;
    const {location} = actor;
    const dispatch = useDispatch();

    useEffect(() => {
        // todo create canvas
        console.log("combat on")
        return () => {
            console.log('combat off ');
        }
    }, [combat]);

    useEffect(() => {
        if (!actionActive || !location /* || scene.actionQueue?.length*/) {
            return;
        }
        const actionPath = actionPathRef.current;
        const container = actionPath?.parent!;
        const mouseMove = (event: PIXI.InteractionEvent) => {
            if (actionActive && location && actionPath) {
                // Find out if on a blocked tile
                const destinationLocation = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
                const blocked = controller.locationIsBlocked(destinationLocation);
                let enoughAp = true;
                const from = new PIXI.Point(location[0] * tileWidth + tileWidth / 2,
                    location[1] * tileHeight + tileHeight / 2);

                if (combat) {
                    const ap = controller.calculateWalkApCosts(location, destinationLocation);
                    if (ap > 0) {
                        actionPointsRef.current?.drawAp(destinationLocation, ap);

                        const remaining = actor.ap || -1;
                        enoughAp = remaining >= ap;
                    } else {
                        actionPointsRef.current?.clear();
                    }
                }

                // Draw a line to the destination tile
                actionPath.drawAction(from, event.data.global, !blocked && enoughAp);
            }
        }
        container.on('pointermove', mouseMove);
        return () => {
        container.off('pointermove', mouseMove);
        }
    }, [actionActive, actionPathRef, actionPointsRef, actor.ap, combat, controller, location, tileHeight, tileWidth]);

    const adventurerStartDrag = () => {
        setActionActive(true);
    }

    // Queue actions
    const adventurerEndDrag = (event: PIXI.InteractionEvent) => {
        setActionActive(false);
        const actionPath = actionPathRef.current;

        setActionActive(false);
        actionPath?.clear();
        actionPointsRef.current?.clear();

        if(scene.actionQueue?.length) {
            return;
        }

        const endLocation = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = controller.locationIsBlocked(endLocation);
        if (blocked) {
            return;
        }
        const target = controller.pointToSceneLocation(event.data.global);
        if(target[0] < 0 || target[0] >= controller.mapData?.width! || target[1] < 0 || target[1] >= controller.mapData?.height!) {
            // Released out of bounds
            return;
        }

        // Find path to walk using aStar
        const path = controller.findPath(location!, target);

        if (combat) {
            const remaining = actor.ap || -1;
            if (remaining < (path?.length || 0)){
                return;
            }
        }

        const movementDuration = 500; // time every tile movement takes
        path?.forEach((l, index) => {
            const sceneAction: SceneAction = {
                actionType: SceneActionType.move,
                actor: adventurerId,
                target: l as [number, number],
                endsAt: movementDuration * (index + 1) + performance.now()
            };
            dispatch(enqueueSceneAction(controller.questName, sceneAction));
        });
        dispatch(deductActorAp(controller.questName, adventurerId, path?.length || 0));

    // if (DEBUG_ASTAR) {
    //     const graphics = new PIXI.Graphics();
    //     path?.forEach((tile) => {
    //         const [x, y] = tile;
    //         const stroke = 3;
    //         graphics.beginFill(0xDE3249, 0.5);
    //         graphics.lineStyle(stroke, 0xFF0000);
    //         graphics.drawRect(x * tileWidth + stroke / 2,
    //             y * tileHeight + stroke / 2,
    //             tileWidth - stroke / 2,
    //             tileHeight - stroke / 2);
    //         graphics.endFill();
    //     });
    //     ref.current!.addChild(graphics);
    //     setTimeout(() => {
    //         ref.current?.removeChild(graphics)}
    //     , 1000);
    // }
    }
    return {
        adventurerStartDrag,
        adventurerEndDrag
    }
}

export default useSceneAdventurerActions;
