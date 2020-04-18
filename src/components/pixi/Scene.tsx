import React, { useEffect, useState } from "react";
import { Container, Stage, Graphics, Sprite } from '@inlet/react-pixi';
import { TiledMapData } from 'constants/tiledMapData';
import Tilemap from './Tilemap';
import SceneObject from './SceneObject';

import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap';


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
    const [actorPosition, setActorPosition] = useState([0, 0]);
    const { jsonPath } = props;

    useEffect(() => {

        new PIXI.Loader().add(jsonPath).load((loader)=>{            
            const mapData: TiledMapData = loader.resources[jsonPath].data;
            setMapData(mapData);
        });
    }, [jsonPath]);

    const basePath = jsonPath.substr(0, jsonPath.lastIndexOf('/'));

    const handleClick = (event: PIXI.interaction.InteractionEvent) => {
        const scenePosition = pointToScenePosition(event.data.global);
        setActorPosition(scenePosition);
    }

    const sceneWidth = (mapData?.width || 0) * (mapData?.tilewidth || 0) || DEFAULT_WIDTH;
    const sceneHeight = (mapData?.height || 0) * (mapData?.tileheight || 0) || DEFAULT_HEIGHT;


    const pointToScenePosition = (point: PIXI.Point) => {
        if (!mapData?.tilewidth || !mapData.tileheight) {
            return [0, 0];
        }
        return [Math.floor(point.x / mapData?.tilewidth ), Math.floor(point.y / mapData?.tilewidth)];
    }

    return (
        <Stage width={sceneWidth} height={sceneHeight} >
            <Container 
                pointertap={handleClick} 
                interactive={true} 
                hitArea={new PIXI.RoundedRectangle(0, 0, sceneWidth, sceneHeight, 0)}
            >
                { mapData && (
                    <Tilemap basePath={basePath} data={mapData} />
                )}

                { mapData && (
                    <SceneObject
                        tileWidth={mapData.tilewidth}
                        tileHeight={mapData.tilewidth}
                        scenePosition={actorPosition}
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
                            // x={30}
                            y={-80}
                            image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`} 
                        />

                    </SceneObject>
                )}
            </Container>
        </Stage>
    );
}

export default Scene;
