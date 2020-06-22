import React, { useEffect, useState, useRef, useMemo } from "react";
import { Container, Graphics, Sprite } from '@inlet/react-pixi';
import { useDispatch } from 'react-redux';
import Tilemap from './Tilemap';
import ActionPath, { RefActions } from './ActionPath';
import { SceneAction, SceneActionType, ActorObject } from 'stores/scene';
import { enqueueSceneAction } from 'actions/quests';
import BridgedStage from 'components/pixi/util/BridgedStage';
import SceneActor from './SceneActor';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import useQuest from 'hooks/useQuest';

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap'; // tilemap is not a real npm module :/

export interface Props {
    questName: string;
    controller: BaseSceneController;
    selectedActor: string;
    setSelectedActor: (actor: string) => void;
    onLootCacheChanged: (value: string) => void; // todo: opens loot cache popup
}

const DEBUG_ASTAR = false;
const DEBUG_ACTIONQUEUE = false;

const Scene = (props: Props) => {
    const {controller} = props;
    const [actionActor, setActionActor] = useState<ActorObject|null>(null); // actor that the player is performing an action on

    const mapData = controller.mapData!;
    const basePath = controller.basePath!;

    const dispatch = useDispatch();
    const ref = useRef<PIXI.Container>(null);

    const quest = useQuest(props.questName);

    const scene = quest.scene!;

    const selectedActor = useMemo(() => {
        return scene.actors?.find(a => a.name === props.selectedActor) || null;
    }, [scene.actors, props.selectedActor])

    const handleActorStartDrag = (actor: ActorObject) => {
        if(!scene.actionQueue || scene.actionQueue.length === 0){
            setActionActor(actor);
        }
        props.setSelectedActor(actor.name);
    }

    const handleCancelAction = (event: PIXI.InteractionEvent) => {
        setActionActor(null);
        event.stopPropagation();
    }

    // Queue actions
    const handleActorEndDrag = (event: PIXI.InteractionEvent) => {
        if(scene.actionQueue?.length || !actionActor) {
            return;
        }
        props.onLootCacheChanged("chest"); // todo: remove!!

        const location = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = controller.locationIsBlocked(location);
        if (!blocked) {
            const target = controller.pointToSceneLocation(event.data.global);

            const convertLocation = (l: [number, number]) => {
                // This is the format AStarFind works with
                return { x: l[0], y: l[1] }
            }
            const origin = actionActor.location;
            const path = controller.aStar?.findPath(convertLocation(origin), convertLocation(target));

            const movementDuration = 500; // time every tile movement takes
            path?.forEach((l, index) => {
                const sceneAction: SceneAction = {
                    actionType: SceneActionType.move,
                    actor: actionActor!.name,
                    target: l as [number, number],
                    endsAt: movementDuration * (index + 1) + performance.now()
                };
                dispatch(enqueueSceneAction(props.questName, sceneAction));
            });

            if (DEBUG_ASTAR) {
                const graphics = new PIXI.Graphics();
                path?.forEach((tile) => {
                    const [x, y] = tile;
                    const stroke = 3;
                    graphics.beginFill(0xDE3249, 0.5);
                    graphics.lineStyle(stroke, 0xFF0000);
                    graphics.drawRect(x * mapData.tilewidth + stroke / 2,
                        y * mapData.tileheight + stroke / 2,
                        mapData.tilewidth - stroke / 2,
                        mapData.tileheight - stroke / 2);
                    graphics.endFill();
                });
                ref.current!.addChild(graphics);
                setTimeout(() => {
                    ref.current?.removeChild(graphics)}
                , 1000);
            }

        }
        setActionActor(null);
        const actionPath = actionPathRef.current;
        actionPath?.clear();
    }

    const sceneWidth = mapData.width * mapData.tilewidth;
    const sceneHeight = mapData.height * mapData.tileheight;

    // Draw a line to indicate the action to take
    const actionPathRef = useRef<RefActions>(null);
    useEffect(() => {
        const container = ref.current;
        const actionPath = actionPathRef.current;
        if (!container || !actionActor || scene.actionQueue?.length) return;
        const actionOriginLocation = actionActor.location;
        const mouseMove = (event: PIXI.InteractionEvent) => {
            if (container && actionPath && mapData && actionActor) {
                // Find out if on a blocked tile
                const location = controller.pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
                const blocked = controller.locationIsBlocked(location);
                const from = new PIXI.Point(actionOriginLocation[0] * mapData.tilewidth + mapData.tilewidth / 2,
                    actionOriginLocation[1] * mapData.tileheight + mapData.tileheight / 2);

                // Draw a line to the destination tile
                actionPath.drawAction(from, event.data.global, !blocked);
            }
        }
        container.on('pointermove', mouseMove);
        return () => {
            container.off('pointermove', mouseMove);
        }
    }, [mapData, actionActor, controller, scene.actionQueue]);

    const renderActor = (actor: ActorObject) => {
        const {name, location} = actor;
        return (
            <SceneActor
                key={name}
                actor={name}
                controller={controller}
                tileWidth={mapData.tilewidth}
                tileHeight={mapData.tilewidth}
                location={location}
            >
                {selectedActor?.name === name && (
                    <Graphics
                        name="selectioncircle"
                        draw={graphics => {
                            const line = 3;
                            graphics.lineStyle(line, 0xFFFFFF);
                            graphics.drawCircle(mapData.tilewidth / 2, mapData.tileheight / 2, mapData.tilewidth / 2 - line);
                            graphics.endFill();
                        }}
                    />
                )}
                <Sprite
                    y={-80}
                    image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`}
                    interactive={true}
                    pointerdown={() => handleActorStartDrag(actor)}
                    pointerup={handleCancelAction}
                    pointerupoutside={handleActorEndDrag}
                />
                { (selectedActor?.name === name && controller.actorCanInteract(selectedActor.name)) && (
                    <Container
                        interactive={true}
                        pointerdown={() => {controller.actorInteract(selectedActor.name)}}
                    >
                        <Graphics
                            draw={graphics => {
                                graphics.beginFill(0xDE3249);
                                graphics.drawCircle(mapData.tilewidth / 2, mapData.tileheight, mapData.tilewidth / 4);
                                graphics.endFill();
                            }}
                        />
                        <Sprite 
                            image={`${process.env.PUBLIC_URL}/img/ui/scene/icons/interact.png`}
                            scale={[.3, .3]}
                            y={mapData.tileheight}
                            x={mapData.tilewidth/2}
                            anchor={.5}
                    />
                    </Container>
                )}
            </SceneActor>
        );
    }


    return (
        <>
            <BridgedStage width={sceneWidth} height={sceneHeight}>
                <Container
                    ref={ref}
                    interactive={true}
                    hitArea={new PIXI.Rectangle(0, 0, sceneWidth, sceneHeight)}
                >
                    <Tilemap
                        basePath={basePath}
                        data={mapData}
                        tileObjects={scene.tileObjects}
                    />
                    <ActionPath
                        ref={actionPathRef}
                    />
                    { /** todo: create SceneAventurer  */
                    scene.actors?.map((o) => renderActor(o))}
                </Container>
            </BridgedStage>
            {DEBUG_ACTIONQUEUE && (
                <div style={{ position: 'absolute', bottom: 0}}>
                    <h2>ActionQueue</h2>
                    <ul>
                        {scene.actionQueue && scene.actionQueue.map((action) => (
                            <li key={JSON.stringify(action)}>{JSON.stringify(action)}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default Scene;
