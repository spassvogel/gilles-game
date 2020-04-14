import React, { useRef, useEffect, useState } from "react";
import { useApp, Container } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import path from 'path';
import Mesh from './Mesh';

enum Orientation {
    orthagonal = "orthagonal",
    isometric = "isometric",
    staggered = "staggered",
    hexagonal = "hexagonal"
}

enum RenderOrder {
    rightUp = "right-up",
    rightDown = "right-down",
    leftUp = "left-up",
    leftDown = "left-down"
}

interface TilesetData {
    columns: number;
    source: string;
    image: string;
    imagewidth: number;
    imageheight: number;
    tilewidth: number;
    tileheight: number;
    name: string;
}

interface LayerData {
    data: Array<number>;
    height: number;
    id: number;
    name: string;
    opacity: number; // not supported atm
    visible: boolean;
    x: number;
    y: number;
    width: number;    
}

interface MapData {
    width: number;
    height: number;
    infinite: boolean;
    backgroundcolor: string | null;
    orientation: Orientation;
    renderorder: RenderOrder;
    tilesets: TilesetData[];
    layers: LayerData[];
}

interface Props {
    levelJson: string;
}

const TileMap = (props: Props) => {
    const [shaders, setShaders] = useState<PIXI.Shader[]>();
    const { levelJson } = props;

    useEffect(() => {

        new PIXI.Loader().add(levelJson).load((loader)=>{
            
          const mapData: MapData = loader.resources[levelJson].data;
          const basePath = path.dirname(levelJson.replace(loader.baseUrl, ''));
          const mapWidth = mapData.width;
          const mapHeight =  mapData.height;
        
          // We only support one tileset at the moment. Have to figure out how to handle//]
          // multiple tiles

          const tileset = getTileset(mapData);
          const tileSize: Array<number> = [
              tileset.imagewidth / tileset.tilewidth,
              tileset.imageheight / tileset.tileheight,
          ];

          const shaders = mapData.layers.map((layer: LayerData) => {
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
    }, [levelJson]);

    return (
        <Container>
            { shaders && (
                shaders.map((shader) => {
                    return <Mesh geometry={geometry} shader={shader} key={shader.uniforms.name} /> 
                })
            )}
        </Container>
    );
}

export default TileMap;

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

const parseLayer = (layer: LayerData, tileset: TilesetData): Uint8Array => {
    const columns = tileset.columns;
    const rows = tileset.imageheight / tileset.tileheight;
    console.log(rows)

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

const getTileset = (map: MapData) => {
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