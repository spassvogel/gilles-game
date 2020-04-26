import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container, Stage, Graphics, Sprite } from '@inlet/react-pixi';
import { TiledMapData } from 'constants/tiledMapData';
import Tilemap from './Tilemap';
import SceneObject from './SceneObject';
import ActionPath, { RefActions } from './ActionPath';
import { AStarFinder } from "astar-typescript";

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap'; // tilemap is not a real npm module :/


interface Props {
    jsonPath: string;
}

const DEBUG = false;
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 1000;

const Scene = (props: Props) => {
    const [mapData, setMapData] = useState<TiledMapData>();
    const [actorLocation, setActorLocation] = useState([0, 0]);
    const [actionOriginLocation, setActionOriginLocation] = useState<number[] | null>(null);
    const [blockedTiles, setBlockedTiles] = useState<number[][]>([]);
    const ref = useRef<PIXI.Container>(null);
    const { jsonPath } = props;

    useEffect(() => {
        new PIXI.Loader().add(jsonPath).load((loader)=>{            
            const mapData: TiledMapData = loader.resources[jsonPath].data;
            setMapData(mapData);
        });
    }, [jsonPath]);

    const basePath = jsonPath.substr(0, jsonPath.lastIndexOf('/'));

    const handleActorStartDrag = (event: PIXI.interaction.InteractionEvent) => {
        setActionOriginLocation(actorLocation);
    }
    const handleActorEndDrag = (event: PIXI.interaction.InteractionEvent) => {
        setActionOriginLocation(null);
        const location = pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
        const blocked = locationIsBlocked(location);
        if (!blocked) {
            const scenePosition = pointToSceneLocation(event.data.global);
            setActorLocation(scenePosition);    
        }

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

    const locationIsBlocked = useCallback((location: number[]) => {
        return blockedTiles.some((l) => l[0] === location[0] && l[1] === location[1]);
    }, [blockedTiles]);

    const actionPathRef = useRef<RefActions>(null);
    useEffect(() => {
        const container = ref.current;
        const actionPath = actionPathRef.current;
        if (!container || !mapData) return;
        const mouseMove = (event: PIXI.interaction.InteractionEvent) => {
            if (container && actionPath && mapData && actionOriginLocation) {
                // Find out if on a blocked tile
                const location = pointToSceneLocation(new PIXI.Point(event.data.global.x, event.data.global.y));
                const blocked = locationIsBlocked(location);
                const from = new PIXI.Point(actionOriginLocation[0] * mapData.tilewidth + mapData.tilewidth / 2, 
                    actionOriginLocation[1] * mapData.tileheight + mapData.tileheight / 2);
                    
                actionPath.drawAction(from, event.data.global, !blocked);
            }
        }
        container.on('pointermove', mouseMove);
        return () => {
            container.off('pointermove', mouseMove);
        }
    }, [mapData, blockedTiles, actionOriginLocation, pointToSceneLocation, locationIsBlocked]);

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
                { mapData && (
                    <SceneObject
                        tileWidth={mapData.tilewidth}
                        tileHeight={mapData.tilewidth}
                        sceneLocation={actorLocation}
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
                            pointerdown={handleActorStartDrag}
                            pointerupoutside={handleActorEndDrag}
                        />

                    </SceneObject>
                )}
            </Container>
        </Stage>
    );
}

export default Scene;
