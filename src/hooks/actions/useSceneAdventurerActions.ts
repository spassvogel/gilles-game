import { useEffect, useState } from 'react';

import useQuest from 'hooks/store/useQuest';
import { SceneActionType } from 'store/types/scene';
import { RefActionPoints } from 'components/world/QuestPanel/QuestDetails/scene/ActionPoints';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';

// todo: deprecated
const useSceneAdventurerActions = (adventurerId: string, parent: React.RefObject<PIXI.Container>, controller: BaseSceneController<any>, actionPointsRef: React.RefObject<RefActionPoints>, placeCombatUI:  (location: [number, number]) => void) => {
    // todo: instead just provide a pixi container to draw on...
    const [actionActive, setActionActive] = useState(false);
    const { tileWidth, tileHeight } = controller.getTileDimensions();
    const scene = useQuest(controller.questName).scene!;
    const { combat } = scene!;
    const actor = controller.getSceneActor(adventurerId)!;
    const { location } = actor;

    useEffect(() => {
        // todo create canvas
        console.log("combat on", parent.current)

        return () => {
            console.log('combat off ');
        }
    }, [combat]);

    useEffect(() => {
        if (!actionActive || !location || !parent.current /* || scene.actionQueue?.length*/) {
            return;
        }

        const { tileWidth, tileHeight } = controller.getTileDimensions();

        const container = parent.current;
        const actionContainer = new PIXI.Graphics();
        container.addChild(actionContainer);

        // todo: custom class?
        // const dot = new CombatActionDot(tileWidth, tileHeight);
        // container.addChild(dot);
        // dot.setActionTabs([{
        //     action: SceneActionType.move,
        //     icon: "walking-boot"
        // }, {
        //     action: SceneActionType.inspect,
        //     icon: "sunken-eye"
        // }, {
        //     action: SceneActionType.attack,
        //     icon: "crosshair"
        // }]);

        const mouseMove = (event: PIXI.InteractionEvent) => {
            if (actionActive && location) {
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

                    // Place the dot
                    placeCombatUI(destinationLocation);
                    //dot.x = destinationLocation[0] * tileWidth + tileWidth / 2;
                    //dot.y = destinationLocation[1] * tileHeight + tileHeight / 2;
                }


                // todo: draw the actual path to walk instead

                // Draw a line to the destination tile
                const to = event.data.global;
                const allowed = !blocked && enoughAp;
                const color = allowed ? 0x00FF00 : 0xFF3300;
                actionContainer.clear()
                    .lineStyle(3, color)
                    .moveTo(from.x, from.y)
                    .lineTo(to.x, to.y);

            }
        }
        container.on('pointermove', mouseMove);
        return () => {
            console.log('clean')
            container.off('pointermove', mouseMove);
            parent.current?.removeChild(actionContainer);
            //parent.current?.removeChild(dot);
        }
    }, [actionActive, actionPointsRef, actor.ap, combat, controller, location, tileHeight, tileWidth]);

    const adventurerStartDrag = () => {
        setActionActive(true);
    }

    // Queue actions
    const adventurerEndDrag = (event: PIXI.InteractionEvent) => {
        setActionActive(false);

        actionPointsRef.current?.clear();

        if (scene.actionQueue?.length) {
            return;
        }

        const endLocation = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = controller.locationIsBlocked(endLocation);
        if (blocked) {
            return;
        }
        const target = controller.pointToSceneLocation(event.data.global);
        if (target[0] < 0 || target[0] >= controller.mapData?.width! || target[1] < 0 || target[1] >= controller.mapData?.height!) {
            // Released out of bounds
            return;
        }
        if (!combat) {
            controller.actorAttemptAction(actor.name!, SceneActionType.move, target);
        }
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
