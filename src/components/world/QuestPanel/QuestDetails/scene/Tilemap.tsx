import React from 'react';
import { TiledMapData, TiledLayerData, TiledTilesetData, TiledLayerType } from 'constants/tiledMapData';
import { Container } from '@inlet/react-pixi';
import RectTileLayer from 'components/pixi/tile/RectTileLayer';
import * as PIXI from 'pixi.js';

interface Props {
    basePath: string;
    data: TiledMapData;
    spritesheets: {[key: string]: PIXI.Spritesheet}
}

const Tilemap = (props: Props) => {
    const {data, spritesheets} = props;

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
