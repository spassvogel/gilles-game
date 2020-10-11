import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import React, { useRef, useEffect, useState, memo } from 'react';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { useDispatch } from 'react-redux';
import useQuest from 'hooks/store/useQuest';
import { deductActorAp, enqueueSceneAction } from 'actions/quests';
import { SceneAction, SceneActionType } from 'stores/scene';
import ActionPath, { RefActions } from './ActionPath';
import { useAdventurerState } from 'hooks/store/adventurers';
import ActionPoints, { RefActionPoints } from './ActionPoints';

interface Props  {
    name: string;
    selected: boolean;
    setSelectedActor: (actor: string) => void;
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

    const quest = useQuest(controller.questName);
    const scene = quest.scene!;
    const {combat} = scene;

    const adventurer = useAdventurerState(name);

    // Draw a line to indicate the action to take
    const actionPathRef = useRef<RefActions>(null);
    const actionPointsRef = useRef<RefActionPoints>(null);
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

                if (combat) {
                    const ap = controller.calculateWalkApCosts(location, destinationLocation);
                    if (ap > 0) {
                        actionPointsRef.current?.drawAp(destinationLocation, ap);
                    } else {
                        actionPointsRef.current?.clear();
                    }
                }
            }
        }
        container.on('pointermove', mouseMove);
        return () => {
           container.off('pointermove', mouseMove);
        }
    }, [actionActive, combat, controller, location, tileHeight, tileWidth]);

    const handleActorStartDrag = () => {
        setActionActive(true);
        props.setSelectedActor(name);
    }

    // Queue actions
    const handleActorEndDrag = (event: PIXI.InteractionEvent) => {
        setActionActive(false);
        const actionPath = actionPathRef.current;
        if(scene.actionQueue?.length) {
            actionPath?.clear();
            actionPointsRef.current?.clear();
            return;
        }

        const endLocation = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = controller.locationIsBlocked(endLocation);
        if (!blocked) {
            const target = controller.pointToSceneLocation(event.data.global);
            if(target[0] < 0 || target[0] >= controller.mapData?.width! || target[1] < 0 || target[1] >= controller.mapData?.height!) {
                // Released out of bounds
                actionPath?.clear();
                actionPointsRef.current?.clear();
                return;
            }

            // Find path to walk using aStar
            const path = controller.findPath(location!, target);

            const movementDuration = 500; // time every tile movement takes
            path?.forEach((l, index) => {
                const sceneAction: SceneAction = {
                    actionType: SceneActionType.move,
                    actor: name,
                    target: l as [number, number],
                    endsAt: movementDuration * (index + 1) + performance.now()
                };
                dispatch(enqueueSceneAction(controller.questName, sceneAction));
            });
            dispatch(deductActorAp(controller.questName, name, path?.length || 0));

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
        actionPath?.clear();
        actionPointsRef.current?.clear();
    }


    return (
        <Container interactive={true}>
            <ActionPath ref={actionPathRef} />
            <ActionPoints ref={actionPointsRef} tileWidth={tileWidth} tileHeight={tileHeight} />
            <SceneActor
                name={name}
                controller={controller}
                location={location}
                interactive={true}
                pointerdown={handleActorStartDrag}
                pointerup={handleActorEndDrag}
                pointerupoutside={handleActorEndDrag}
                hitArea={new PIXI.Rectangle(location?.[0], location?.[1], tileWidth, tileHeight)}
                idleAnimation={Math.random() < 0.5}
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
                {/* <Sprite
                    y={-80}
                    image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`}
                /> */}
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
                        {/* <Graphics
                            draw={graphics => {
                                graphics.beginFill(0xDE3249);
                                graphics.drawCircle(tileWidth / 2, tileHeight, tileWidth / 4);
                                graphics.endFill();
                            }}
                        /> */}
                        <Sprite
                            image={`${process.env.PUBLIC_URL}/img/scene/ui/background.png`}
                            width={tileWidth / 2}
                            height={tileWidth / 2}
                            y={tileHeight}
                            x={tileWidth/2}
                            anchor={.5}
                        />
                        <Sprite
                            image={`${process.env.PUBLIC_URL}/img/scene/ui/interact.png`}
                            width={tileWidth / 2}
                            height={tileWidth / 2}
                            y={tileHeight}
                            x={tileWidth/2}
                            anchor={.5}
                        />
                    </Container>
                )}
            </SceneActor>
        </Container>
    )
}

export default memo(SceneAdventurer);
