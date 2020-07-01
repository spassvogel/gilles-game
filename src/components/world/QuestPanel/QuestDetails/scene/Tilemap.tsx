import React, { useState } from 'react';
import { TiledMapData, TiledLayerData, TiledTilesetData, TiledLayerType } from 'constants/tiledMapData';
import { Container, Text } from '@inlet/react-pixi';
import { useEffect } from 'react';
import { SpritesheetData, SpriteData } from 'constants/spritesheetData';
import RectTileLayer from 'components/pixi/tile/RectTileLayer';
import * as PIXI from 'pixi.js';
import { loadResource } from 'utils/pixiJs';
import { TileObject } from 'stores/scene';
import ObjectTileLayer from 'components/pixi/tile/ObjectTileLayer';

interface Props {
    basePath: string;
    data: TiledMapData;
    tileObjects: TileObject[]; // Objects that don't move
}

const DEBUG = false;

const Tilemap = (props: Props) => {
    const {basePath, data, tileObjects} = props;
    const [layers, setLayers] = useState<JSX.Element[]>();
    const [debug, setDebug] = useState<JSX.Element[]>();

    useEffect(() => {
        const spritesheetData = parseSpritesheetData(data);
        const tileset = getTileset(data);
        loadResource(`${basePath}/${tileset.image}`, (resource) => {
            const texture = resource.texture;
            if (!texture) return;
            PIXI.utils.clearTextureCache();
            const spritesheet = new PIXI.Spritesheet(texture, spritesheetData);
    
            spritesheet.parse(() => {
                const allLayers = data.layers.filter(l => l.visible && l.type === TiledLayerType.tilelayer).map(layer => {
                     return createTileLayer(layer, texture, data.width, tileset, spritesheet);
                });
                allLayers.push(createObjectLayer(tileObjects, texture, tileset, spritesheet));
                setLayers(allLayers);
                
                if (DEBUG){
                    setDebug(getDebug(data.layers[0].data.length, data.layers[0].width, tileset.tilewidth, tileset.tileheight))
                }
            });
    
        })
    }, [basePath, data, tileObjects]);
    return (
        <Container >
            {layers}
            {debug}
        </Container>
    );
}

export default Tilemap;

const getDebug = (tileCount: number, columns: number, tileWidth: number, tileHeight: number) => {
    const elements = [];
    for (let i = 0 ; i < tileCount ; i++) {
        const location = [(i % columns),  Math.floor(i / columns)];
        const x = location[0] * tileWidth;
        const y = location[1] * tileHeight;
        var style = {
            font : 'bold italic 36px Arial',
            fill : '#F7EDCA',
            stroke : '#4a1850',
            strokeThickness : 5,
            wordWrap : true,
            wordWrapWidth : 440
        };
        // tile index
        elements.push(<Text key={`${x},${y}`} style={style} text={`${i}`} x={x} y={y} />);
        // // blocked
        // elements.push(<Graphics
        //     key={`blocked_${x},${y}`}
        //     x={x} y={y}
        //     draw={graphics => {
        //         const line = 3;
        //         const blocked = blockedTiles.some((loc) => loc[0] === location[0] && loc[1] === location[1]);
        //         const color = blocked ? 0xFF3300 : 0x00FF00;
        //         graphics.lineStyle(line, color);
        //         graphics.drawRect(line / 2, line / 2, tileWidth - line / 2, tileHeight - line / 2);
        //         graphics.endFill();
        //     }}
        // />)
    }
    return elements;
}

const getTileset = (mapData: TiledMapData) => {
    if (!mapData.tilesets.length) {
        throw new Error("No tilesets found! Can't continue");
    }
    if (mapData.tilesets.length > 1) {
        console.warn("Found more than one tileset. But we currently only support one.");
    }
    if (mapData.tilesets[0].source) {
        throw new Error("Please embed tilemaps in Tiled! Can't continue");
    }
    return mapData.tilesets[0];
}

const createTileLayer = (layer: TiledLayerData, texture: PIXI.Texture, horizontalTiles: number, tileset: TiledTilesetData, spritesheet: PIXI.Spritesheet) => {
    return (
        <RectTileLayer
            key={layer.name}
            texture={texture} 
            layer={layer} 
            horizontalTiles={horizontalTiles}
            tileset={tileset}
            spritesheet={spritesheet}
        />
    );
}
const createObjectLayer = (objects: TileObject[], texture: PIXI.Texture, tileset: TiledTilesetData, spritesheet: PIXI.Spritesheet) => {
    return (
        <ObjectTileLayer
            key={"objects"}
            objects={objects}
            texture={texture} 
            tileset={tileset}
            spritesheet={spritesheet}
        />
    );
}

const parseSpritesheetData = (mapData: TiledMapData): SpritesheetData => {
    const tileset = getTileset(mapData);
    const columns = tileset.columns;

    const frames: { [name: string]: SpriteData } = {};
    for (let i = 0; i < tileset.tilecount; i++) {
        const w = tileset.tilewidth;
        const h = tileset.tileheight;
        const x = (i % columns) * w;
        const y = Math.floor(i / columns) * h;

        frames[`${tileset.name}-${i + tileset.firstgid}`] = { 
            frame: {x, y, w, h},
            spriteSourceSize: {x, y, w, h},
            rotated: false,
            trimmed: false,
            sourceSize: { w, h}
        };
    }
    const image = tileset.image;
    const size = { w: tileset.imagewidth, h: tileset.imageheight };
    return {
        frames,
        meta: {
            image,
            size,
            scale: 1
        }
    };
}
