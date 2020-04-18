import React, { useEffect, useState } from "react";
import { Container, Stage } from '@inlet/react-pixi';
import Actor from './Actor';
import { TiledMapData } from 'constants/tiledMapData';
import Tilemap from './Tilemap';

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
    const { jsonPath } = props;

    useEffect(() => {

        new PIXI.Loader().add(jsonPath).load((loader)=>{            
            const mapData: TiledMapData = loader.resources[jsonPath].data;
            setMapData(mapData);
        });
    }, [jsonPath]);

    const basePath = jsonPath.substr(0, jsonPath.lastIndexOf('/'));

    const handleClick = (event: PIXI.interaction.InteractionEvent) => {
        console.log(event.data.height, event.data.width)
    }

    const sceneWidth = (mapData?.width || 0) * (mapData?.tilewidth || 0) || DEFAULT_WIDTH;
    const sceneHeight = (mapData?.height || 0) * (mapData?.tileheight || 0) || DEFAULT_HEIGHT;

    return (
        <Stage width={sceneWidth} height={sceneHeight} >
            <Container pointertap={handleClick} interactive={true} >
                { mapData && (
                    <Tilemap basePath={basePath} data={mapData} />
                )}

                { mapData && <Actor
                    x={30}
                    y={30}
                    tileWidth={mapData.tilewidth}
                    tileHeight={mapData.tilewidth}
                    image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`}
                />}
            </Container>
        </Stage>
    );
}

export default Scene;