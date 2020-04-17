import React, { useRef, useEffect, useState } from "react";
import { useApp, Container, Stage, Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import path from 'path';
import Mesh from './Mesh';
import Actor from './Actor';
import { TiledMapData, TiledLayerData, TiledTilesetData } from 'constants/tiledMapData';



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

const Scene = (props: Props) => {
    const [shaders, setShaders] = useState<PIXI.Shader[]>();
    const [sceneProps, setSceneProps] = useState<SceneProps>({
        loaded: false,
        width: 800,
        height: 1000,
    })
    const { jsonPath } = props;

    useEffect(() => {

        new PIXI.Loader().add(jsonPath).load((loader)=>{
            
          const mapData: TiledMapData = loader.resources[jsonPath].data;
          const basePath = path.dirname(jsonPath.replace(loader.baseUrl, ''));
          const mapWidth = mapData.width;
          const mapHeight = mapData.height;
          setSceneProps({
              loaded: true,
              width: mapWidth * mapData.tilewidth,
              height: mapHeight * mapData.tileheight,
              tileWidth: mapData.tilewidth,
              tileHeight: mapData.tileheight,              
          });
        
          // We only support one tileset at the moment. Have to figure out how to handle
          // multiple tilesets

          const tileset = getTileset(mapData);
          const tileSize: Array<number> = [
              tileset.imagewidth / tileset.tilewidth,
              tileset.imageheight / tileset.tileheight,
          ];

          const shaders = mapData.layers.map((layer: TiledLayerData) => {
            // The layers array order is depth sorted. first element in the array is lowest. last is highest

            const mapSize = [mapWidth, mapHeight];
            const map = PIXI.BaseTexture.fromBuffer(parseLayer(layer, tileset), mapWidth, mapHeight );
            const image = PIXI.Texture.from(`${basePath}/${tileset.image}`);

            image.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            image.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;
            
            // make a shader..
            const shader = PIXI.Shader.from(vert, frag, {
                map,
                image,
                tileSize,                           // [nr_of_tiles_wide, nr_of_tiles_high] 
                mapSize,                            // [tiles_width, tiles_height]
                view: [0, 0, mapWidth, mapHeight],  // in tiles
                name: layer.name                    // needed for react key
            });

            return shader;
          });
          
          setShaders(shaders);         
        });
    }, [jsonPath]);


    const handleClick = (event: PIXI.interaction.InteractionEvent) => {
        console.log(event.data.height, event.data.width)
    }
    return (
        <Stage width={sceneProps.width} height={sceneProps.height} >
            <Container pointertap={handleClick} interactive={true}>
                { shaders && (
                    shaders.map((shader) => {
                        return <Mesh geometry={geometry} shader={shader} key={shader.uniforms.name} /> 
                    })
                )}
                { sceneProps.loaded && <Actor
                    x={30}
                    y={30}
                    tileWidth={sceneProps.tileWidth!}
                    tileHeight={sceneProps.tileHeight!}
                    image={`${process.env.PUBLIC_URL}/img/scene/actors/wizard.png`}
                />}
            </Container>
        </Stage>
    );
}

export default Scene;

const geometry = new PIXI.Geometry()
    .addAttribute('position', [ -1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1 ]);

const frag = `
    precision mediump float;
    uniform sampler2D map, image;
    uniform vec2 mapSize, tileSize;
    varying vec2 uv;
    void main() {
        vec2 tileCoord = floor(255.0 * texture2D(map, floor(uv) / mapSize).ra);
        gl_FragColor = texture2D(image, (tileCoord + fract(uv)) / tileSize);
    }`;

const vert = `
    precision mediump float;
    attribute vec2 position;
    uniform vec4 view;
    varying vec2 uv;
    void main() {
        uv = mix(view.xw, view.zy, 0.5 * (1.0 + position));
        gl_Position = vec4(position, 1, 1);
    }`;

const parseLayer = (layer: TiledLayerData, tileset: TiledTilesetData): Uint8Array => {
    const columns = tileset.columns;
    const rows = tileset.imageheight / tileset.tileheight;

    const data = layer.data.reduce((acc: Array<number>, cell, index) => {
        const { x, y } = getTileCoordsByGid(cell, columns, rows);
        acc[index * 4] = x;         // tile x on tilemap
        acc[index * 4 + 1] = 0;
        acc[index * 4 + 2] = 0;
        acc[index * 4 + 3] = y;     // tile y on tilemap 
        return acc;
    }, []);
    return new Uint8Array(data);
}

const getTileCoordsByGid = (cell: number, columns: number, rows: number) => { 
    if (cell === 0) {
        // 0 = empty tile, needs to be 0, 0 in the tileset image
        return { x: 0, y: 0}
    }
    // I have no idea why this works lol
    const x = (cell - 1) % columns;
    const y = Math.floor((cell - 1) / (rows - 1));

    return { x, y };
}

const getTileset = (map: TiledMapData) => {
    if (!map.tilesets.length) {
        throw new Error("No tilesets found! Can't continue");
    }
    if (map.tilesets.length > 1) {
        console.warn("Found more than one tileset. But we currently only support one.");
    }
    if (map.tilesets[0].source) {
        throw new Error("Please embed tilemaps! Can't continue");
    }
    return map.tilesets[0];
}