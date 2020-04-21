import React, { useState } from 'react';
import { TiledMapData, TiledLayerData, TiledTilesetData } from 'constants/tiledMapData';
import { Container } from '@inlet/react-pixi';
import { useEffect } from 'react';
import { SpritesheetData, SpriteData } from 'constants/spritesheetData';
import RectTileLayer from 'components/pixi/RectTileLayer';
import * as PIXI from 'pixi.js';

interface Props {
    basePath: string;
    data: TiledMapData;
}

const Tilemap = (props: Props) => {
    const {basePath, data} = props;
    const [layers, setLayers] = useState<JSX.Element[]>();

    useEffect(() => {
        const spritesheetData = parseSpritesheetData(data);
        const tileset = getTileset(data);

        const texture = PIXI.Texture.from(`${basePath}/${tileset.image}`);
        const baseTexture = PIXI.BaseTexture.from(`${basePath}/${tileset.image}`);
        const spritesheet = new PIXI.Spritesheet(baseTexture, spritesheetData);
        spritesheet.parse(() => {
            const layers = data.layers.filter(layer => layer.visible).map(layer => {
                return createTileLayer(layer, texture, data.width, tileset, spritesheet)
            });
            setLayers(layers);
        });

    }, [basePath, data]);
    return (
        <Container >
            {layers}
        </Container>
    );
}

export default Tilemap;


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
    //var tileLayer = new window.PIXI.tilemap.CompositeRectTileLayer(0, [texture]);
    //const debugContainer = new PIXI.Container();
        /* Debug
        var style = {
            font : 'bold italic 36px Arial',
            fill : '#F7EDCA',
            stroke : '#4a1850',
            strokeThickness : 5,
            wordWrap : true,
            wordWrapWidth : 440
        };
        var richText = new PIXI.Text(`${i}`, style);
        richText.x = x;
        richText.y = y;
        
        debugContainer.addChild(richText); */
    //app.stage.addChild(debugContainer);
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

        frames[`${i + 1}`] = { 
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