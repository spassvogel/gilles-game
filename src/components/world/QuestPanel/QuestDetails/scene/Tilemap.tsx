import React, { useState } from 'react';
import { TiledMapData, TiledLayerData, TiledTilesetData, TiledLayerType } from 'constants/tiledMapData';
import { Container, Text } from '@inlet/react-pixi';
import { useEffect } from 'react';
import { SpritesheetData, SpriteData } from 'constants/spritesheetData';
import RectTileLayer from 'components/pixi/tile/RectTileLayer';
import * as PIXI from 'pixi.js';
import { loadResource } from 'utils/pixiJs';
import { SceneObject } from 'stores/scene';
import ObjectTileLayer from 'components/pixi/tile/ObjectTileLayer';
import useTilesetsLoader from 'hooks/useTilesetsLoader';

interface Props {
    basePath: string;
    data: TiledMapData;
    spritesheets: {[key: string]: PIXI.Spritesheet}
}

const DEBUG = false;

const Tilemap = (props: Props) => {
    const {data, spritesheets} = props;

    /*
      useEffect(() => {
        // const tileset = getTileset(data);
        // const spritesheetData = parseSpritesheetData(data);
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
    }, [basePath, data, tileObjects]);*/
    return (
        <Container >
            {data.layers
                .filter(l => l.visible && l.type === TiledLayerType.tilelayer)
                .map(layer => createTileLayer(layer, data.width, data.tilesets, spritesheets))
            }

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
        const style = {
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



const createTileLayer = (layer: TiledLayerData, horizontalTiles: number, tilesets: TiledTilesetData[], spritesheets: {[key: string]: PIXI.Spritesheet}) => {
    return (
        <RectTileLayer
            key={layer.name}
            layer={layer}
            horizontalTiles={horizontalTiles}
            tilesets={tilesets}
            spritesheets={spritesheets}
        />
    );
}
const createObjectLayer = (objects: SceneObject[], texture: PIXI.Texture, tileset: TiledTilesetData, spritesheet: PIXI.Spritesheet) => {
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

