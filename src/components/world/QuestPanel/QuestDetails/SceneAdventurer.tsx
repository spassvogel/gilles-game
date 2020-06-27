import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import React, { useRef, useEffect, useState } from 'react';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { useDispatch } from 'react-redux';
import useQuest from 'hooks/store/useQuest';
import { enqueueSceneAction } from 'actions/quests';
import { SceneAction, SceneActionType } from 'stores/scene';
import ActionPath, { RefActions } from './ActionPath';
import useAdventurer from 'hooks/store/useAdventurer';

interface Props  {
    questName: string;
    selected: boolean;
    setSelectedActor: (actor: string) => void;
    onLootCacheChanged: (value: string) => void; // todo: opens loot cache popup
};

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children'>) => {
    const {
        controller,
        location,
        name,
        selected,
    } = props;
    const tileWidth = controller.mapData?.tilewidth!;
    const tileHeight = controller.mapData?.tileheight!;
    const dispatch = useDispatch();

    const quest = useQuest(props.questName);
    const scene = quest.scene!;

    const adventurer = useAdventurer(name);

    // Draw a line to indicate the action to take
    const actionPathRef = useRef<RefActions>(null);
    const [actionActive, setActionActive] = useState(false);
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
                const from = new PIXI.Point(location[0] * tileWidth + tileWidth / 2,
                    location[1] * tileHeight + tileHeight / 2);

                // Draw a line to the destination tile
                actionPath.drawAction(from, event.data.global, !blocked);
            }
        }
        container.on('pointermove', mouseMove);
        return () => {
           container.off('pointermove', mouseMove);
        }
    }, [actionActive, controller, location, tileHeight, tileWidth]);

    const handleActorStartDrag = () => {
        setActionActive(true);
        props.setSelectedActor(name);
    }

    const handleCancelAction = (event: PIXI.InteractionEvent) => {
        setActionActive(false);
        event.stopPropagation();
    }

    // Queue actions
    const handleActorEndDrag = (event: PIXI.InteractionEvent) => {
        if(scene.actionQueue?.length) {
            return;
        }
        props.onLootCacheChanged("chest"); // todo: remove!!

        const endLocation = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = controller.locationIsBlocked(endLocation);
        if (!blocked) {
            const target = controller.pointToSceneLocation(event.data.global);

            const convertLocation = (l: [number, number]) => {
                // This is the format AStarFind works with
                return { x: l[0], y: l[1] }
            }
            const origin = location!;
            const path = controller.aStar?.findPath(
                convertLocation(origin), convertLocation(target)
            );

            const movementDuration = 500; // time every tile movement takes
            path?.forEach((l, index) => {
                const sceneAction: SceneAction = {
                    actionType: SceneActionType.move,
                    actor: name,
                    target: l as [number, number],
                    endsAt: movementDuration * (index + 1) + performance.now()
                };
                dispatch(enqueueSceneAction(props.questName, sceneAction));
            });

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
        setActionActive(false);
        const actionPath = actionPathRef.current;
        actionPath?.clear();
    }

    return (
        <>
            <ActionPath ref={actionPathRef} />
            <SceneActor
                key={name}
                name={name}
                controller={controller}
                location={location}
            >
                {selected && (
                    <Graphics
                        name="selectioncircle"
                        draw={graphics => {
                            const line = 3;
                            graphics.lineStyle(line, 0xFFFFFF);
                            graphics.drawCircle(tileWidth / 2, tileHeight / 2, tileWidth / 2 - line);
                            graphics.endFill();
                        }}
                    />
                )}
                <Sprite
                    y={-80}
                    image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`}
                    interactive={true}
                    pointerdown={handleActorStartDrag}
                    pointerup={handleCancelAction}
                    pointerupoutside={handleActorEndDrag}
                />
                <Sprite
                    scale={.1}
                    anchor={.5}
                    x={tileWidth / 2}
                    y={-30}
                    image={`${process.env.PUBLIC_URL}/${adventurer.avatarImg}`}
                />
                { (selected && controller.actorCanInteract(name)) && (
                    <Container
                        interactive={true}
                        pointerdown={() => {controller.actorInteract(name)}}
                    >
                        <Graphics
                            draw={graphics => {
                                graphics.beginFill(0xDE3249);
                                graphics.drawCircle(tileWidth / 2, tileHeight, tileWidth / 4);
                                graphics.endFill();
                            }}
                        />
                        <Sprite
                            image={`${process.env.PUBLIC_URL}/img/ui/scene/icons/interact.png`}
                            scale={[.3, .3]}
                            y={tileHeight}
                            x={tileWidth/2}
                            anchor={.5}
                    />
                    </Container>
                )}
            </SceneActor>
        </>
    )
}

export default SceneAdventurer;
