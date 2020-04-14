import React from "react";
import TiledMapContainer from 'components/tiled';
import { Stage } from '@inlet/react-pixi';

// todo: multiple layers 

// const Viewport = React.forwardRef<PixiViewport, any>((props, ref) => {

// const tiledPath = `${process.env.PUBLIC_URL}scenes/ork-dungeon-level1.tmx`;
const tiledPath = `${process.env.PUBLIC_URL}tiled/test-map.tmx`;

const TileMap = () => {
    // const ref = useRef();
    // var loader = new PIXI.Loader();
    // loader.add('atlas', 'basic/atlas.json');
    // loader.load(function(loader, resources) {
    //     var tilemap = new PIXI.tilemap.CompositeRectTileLayer(0, [resources['atlas_image']!.texture]);
    //     var size = 32;
    //     // bah, im too lazy, i just want to specify filenames from atlas
    //     for (var i=0;i<7;i++)
    //         for (var j=0;j<7;j++) {
    //             tilemap.addFrame("grass.png", i*size, j*size);
    //             if (i%2==1 && j%2==1)
    //                 tilemap.addFrame("tough.png", i*size, j*size);
    //         }

    //     // if you are lawful citizen, please use textures from the loader
    //     var textures = resources.atlas.textures;
    //     tilemap.addFrame(textures["brick.png"], 2*size, 2*size);
    //     tilemap.addFrame(textures["brick_wall.png"], 2*size, 3*size);

    //     //renderer.render(tilemap);
    // });

    return (
        <Stage>
            <TiledMapContainer
                // ref={mapRef}
                // @ts-ignore
                tiledPath={tiledPath}
                // onTick={onTick}
            
                // scale={scale}
                // x ={offsetX}
                // y ={offsetY}
                interactive={true}
            
            />
        </Stage>
    );
}

export default TileMap;