import React, { useEffect, useState } from "react";
import { Container, Stage, Graphics, Sprite } from '@inlet/react-pixi';
import { TiledMapData } from 'constants/tiledMapData';
import Tilemap from './Tilemap';
import SceneObject from './SceneObject';
import ActionPath from './ActionPath';

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap'; // tilemap is not a real npm module :/


interface Props {
    jsonPath: string;
}

interface SceneProps {
    loaded: boolean;
    width: number;
    height: number;
    tileWidth?: number;
    tileHeight?: number;
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 1000;

const Scene = (props: Props) => {
    const [mapData, setMapData] = useState<TiledMapData>();
    const [actorLocation, setActorLocation] = useState([0, 0]);
    const [actionOriginLocation, setActionOriginLocation] = useState<number[] | null>(null);
    //const [actionDestinationPosition, setActionDestinationPosition] = useState<PIXI.Point | null>(null);
    const { jsonPath } = props;

    useEffect(() => {

        new PIXI.Loader().add(jsonPath).load((loader)=>{            
            const mapData: TiledMapData = loader.resources[jsonPath].data;
            setMapData(mapData);
        });
    }, [jsonPath]);

    const basePath = jsonPath.substr(0, jsonPath.lastIndexOf('/'));

    // const handleSceneClick = (event: PIXI.interaction.InteractionEvent) => {
    //     const scenePosition = pointToSceneLocation(event.data.global);
    //     setActorLocation(scenePosition);
    //     console.log(scenePosition);

    // }

    // const handleSceneMove = (event: PIXI.interaction.InteractionEvent) => {
    //     if(!actionOriginLocation) { 
    //         return;
    //     }
    //     setActionDestinationPosition(event.data.global);
    // }

    const handleActorStartDrag = (event: PIXI.interaction.InteractionEvent) => {
        setActionOriginLocation(actorLocation);
        //console.log(actorLocation);
    }
    const handleActorEndDrag = (event: PIXI.interaction.InteractionEvent) => {
        setActionOriginLocation(null);
        const scenePosition = pointToSceneLocation(event.data.global);
        setActorLocation(scenePosition);
    }

    const sceneWidth = (mapData?.width || 0) * (mapData?.tilewidth || 0) || DEFAULT_WIDTH;
    const sceneHeight = (mapData?.height || 0) * (mapData?.tileheight || 0) || DEFAULT_HEIGHT;

    const pointToSceneLocation = (point: PIXI.Point) => {
        if (!mapData?.tilewidth || !mapData.tileheight) {
            return [0, 0];
        }
        return [Math.floor(point.x / mapData?.tilewidth ), Math.floor(point.y / mapData?.tilewidth)];
    }

    return (
        <Stage width={sceneWidth} height={sceneHeight} >
            <Container 
                // pointertap={handleSceneClick} 
                // pointermove={handleSceneMove}
                interactive={true} 
                hitArea={new PIXI.RoundedRectangle(0, 0, sceneWidth, sceneHeight, 0)}
            >
                { mapData && (
                    <Tilemap basePath={basePath} data={mapData} />
                )}
                { (actionOriginLocation && mapData) && (
                    <ActionPath
                        tileWidth={mapData.tilewidth}
                        tileHeight={mapData.tilewidth}
                        sceneLocation={actionOriginLocation}
                        // mousePosition={actionDestinationPosition!}
                    />
                )}
                { mapData && (
                    <SceneObject
                        tileWidth={mapData.tilewidth}
                        tileHeight={mapData.tilewidth}
                        sceneLocation={actorLocation}
                    >
                        <Graphics
                            name="hitarea"
                            draw={graphics => {
                                const line = 3;
                                graphics.lineStyle(line, 0xFF0000);
                                graphics.drawRect(line / 2, line / 2, mapData.tilewidth - line / 2, mapData.tileheight - line / 2);
                                graphics.endFill();
                            }}
                        />
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
