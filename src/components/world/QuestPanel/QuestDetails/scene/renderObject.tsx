import React, {  } from "react";
import SceneObjectWrapper from './SceneObjectWrapper';
import { SceneObject } from 'store/types/scene';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { Sprite } from '@inlet/react-pixi';
import { TiledTilesetData } from 'constants/tiledMapData';

const renderObject = (object: SceneObject, controller: BaseSceneController<any>, spritesheets: {[key: string]: PIXI.Spritesheet} ) => {

    if (object.gid){
        // const tilesets = controller.mapData!.tilesets;
        const tileset = findTileset(object.gid, controller.mapData!.tilesets);
        const spritesheet = spritesheets[tileset.name]
        return (
            <SceneObjectWrapper
                key={`${object.name}${object.location[0]}${object.location[1]}`}
                controller={controller}
                location={object.location}
            >
                <Sprite
                    name={object.name}
                    texture={spritesheet.textures[`${tileset.name}-${object.gid}`]}
                />
            </SceneObjectWrapper>
        )
    }
    return  <div/>
}

export default renderObject;

const findTileset = (gid: number, tilesets: TiledTilesetData[]) => {
    for (let i = tilesets.length - 1; i >= 0; i--) {
        if (tilesets[i].firstgid <= gid) {
            return tilesets[i];
        }
    }
    return tilesets[0];
}
