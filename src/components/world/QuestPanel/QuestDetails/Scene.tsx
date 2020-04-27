import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Container, Stage, Graphics, Sprite } from '@inlet/react-pixi';
import { TiledMapData } from 'constants/tiledMapData';
import Tilemap from './Tilemap';
import SceneObject from './SceneObject';
import ActionPath, { RefActions } from './ActionPath';
import { AStarFinder } from "astar-typescript";
import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { QuestStoreState } from 'stores/quest';
import { Actor } from 'stores/scene';

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap'; // tilemap is not a real npm module :/


interface Props {
    jsonPath: string;
    questName: string;
}

const DEBUG = true;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 1000;

const Scene = (props: Props) => {
    const [mapData, setMapData] = useState<TiledMapData>();
    const [actionActor, setActionActor] = useState<Actor | null>(null);
    const [blockedTiles, setBlockedTiles] = useState<number[][]>([]);
    const ref = useRef<PIXI.Container>(null);
    const { jsonPath } = props;


    const questSelector = useCallback(
        (state: StoreState) => state.quests.find((q) => q.name === props.questName)!, 
        [props.questName]
    );
    const quest = useSelector<StoreState, QuestStoreState>(questSelector);
    const { scene } = quest;

    useEffect(() => {
        new PIXI.Loader().add(jsonPath).load((loader)=>{            
            const mapData: TiledMapData = loader.resources[jsonPath].data;
            setMapData(mapData);
        });
    }, [jsonPath]);

    const basePath = jsonPath.substr(0, jsonPath.lastIndexOf('/'));

    const handleActorStartDrag = (actor: Actor) => {
        setActionActor(actor);
    }

    const handleActorEndDrag = (event: PIXI.interaction.InteractionEvent) => {
        const location = pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = locationIsBlocked(location);
        if (!blocked) {
            const sceneLocation = pointToSceneLocation(event.data.global);
            //setActorLocation(sceneLocation);

            const convertLocation = (location: number[]) => {
                return { x: location[0], y: location[1] }
            }
            const origin = actionActor!.location;
            const path = aStar?.findPath(convertLocation(origin), convertLocation(sceneLocation));
            if (DEBUG) {
                const graphics = new PIXI.Graphics();
                path?.forEach((tile) => {
                    const [x, y] = tile;
                    const stroke = 3;
                    graphics.beginFill(0xDE3249, 0.5);
                    graphics.lineStyle(stroke, 0xFF0000);
                    graphics.drawRect(x * mapData!.tilewidth + stroke / 2, 
                        y * mapData!.tileheight + stroke / 2, 
                        mapData!.tilewidth - stroke / 2, 
                        mapData!.tileheight - stroke / 2);
                    graphics.endFill();
                });
                ref.current!.addChild(graphics);
                setTimeout(() => { ref.current!.removeChild(graphics)}, 1000);
            }

        }
        setActionActor(null);
        const actionPath = actionPathRef.current;
        actionPath?.clear();
    }

    const sceneWidth = (mapData?.width || 0) * (mapData?.tilewidth || 0) || DEFAULT_WIDTH;
    const sceneHeight = (mapData?.height || 0) * (mapData?.tileheight || 0) || DEFAULT_HEIGHT;

    const pointToSceneLocation = useCallback((point: PIXI.Point) => {
        if (!mapData?.tilewidth || !mapData.tileheight) {
            return [0, 0];
        }
        return [Math.floor(point.x / mapData?.tilewidth ), Math.floor(point.y / mapData?.tilewidth)];
    }, [mapData]);

    /** Returns true if the tile is blocked */
    const locationIsBlocked = useCallback((location: number[]) => {
        return blockedTiles.some((l) => l[0] === location[0] && l[1] === location[1]);
    }, [blockedTiles]);

    const actionPathRef = useRef<RefActions>(null);
    useEffect(() => {
        const container = ref.current;
        const actionPath = actionPathRef.current;
        if (!container || !mapData || !actionActor) return;
        const actionOriginLocation = actionActor.location;
        const mouseMove = (event: PIXI.interaction.InteractionEvent) => {
            if (container && actionPath && mapData && actionActor) {
                // Find out if on a blocked tile
                const location = pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
                const blocked = locationIsBlocked(location);
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
    }, [mapData, blockedTiles, actionActor, pointToSceneLocation, locationIsBlocked]);

    const aStar = useMemo(() => {
        if (!mapData || !blockedTiles.length) {
            return null;
        }
        const matrix: number[][] = [];
        for (let y = 0; y < mapData.height; y++) {
            const row: number[] = [];
            for (let x = 0; x < mapData.width; x++) {
                const location = [x, y];
                const blocked = locationIsBlocked(location);
                row.push(blocked ? 1 : 0);
            }
            matrix.push(row);
        }
        return new AStarFinder({
            grid: {
                matrix
            }
        });
    }, [mapData, locationIsBlocked, blockedTiles])

    return (
        <Stage width={sceneWidth} height={sceneHeight} >
            <Container 
                ref={ref}
                interactive={true} 
                hitArea={new PIXI.RoundedRectangle(0, 0, sceneWidth, sceneHeight, 0)}
            >
                { mapData && (
                    <Tilemap basePath={basePath} data={mapData} setBlockedTiles={setBlockedTiles}/>
                )}
                <ActionPath
                    ref={actionPathRef}
                />
                { mapData && scene.actors.map((a) => (
                    <SceneObject
                        key={a.name}
                        tileWidth={mapData.tilewidth}
                        tileHeight={mapData.tilewidth}
                        location={a.location}
                    >
                        {DEBUG && (<Graphics
                            name="hitarea"
                            draw={graphics => {
                                const line = 3;
                                graphics.lineStyle(line, 0xFF0000);
                                graphics.drawRect(line / 2, line / 2, mapData.tilewidth - line / 2, mapData.tileheight - line / 2);
                                graphics.endFill();
                            }}
                        />)}
                        <Sprite                     
                            y={-80}
                            image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`} 
                            interactive={true}
                            pointerdown={() => handleActorStartDrag(a)}
                            pointerupoutside={handleActorEndDrag}
                        />

                    </SceneObject>
                ))}
            </Container>
        </Stage>
    );
}

export default Scene;
