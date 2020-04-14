import React, { useRef, useEffect } from "react";
import TiledMapContainer from 'components/tiled';
import { Stage, useApp, Container, useTick } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import path from 'path';

// todo: multiple layers 

// const Viewport = React.forwardRef<PixiViewport, any>((props, ref) => {

// const tiledPath = `${process.env.PUBLIC_URL}scenes/ork-dungeon-level1.tmx`;
const tiledPath = `${process.env.PUBLIC_URL}/scenes/ork-dungeon-level1.json`;

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

const TileMap = () => {
    const app = useApp();
    const ref = useRef<Container>(null);

    const parseMap = (map: any) => {
        var data = [];
        let count = 0;

        for (var i = 0; i < map.length; i++)
        {
            for (var j = 0; j < map[i].length; j++)
            {
                data[count++] = map[i][j][0];   // x
                data[count++] = 0
                data[count++] = 0;
                data[count++] = map[i][j][1];   // y
            }
        }
        return new Uint8Array( data );
    }

    const parseLayer = (layer: LayerData): Uint8Array => {
        const data = layer.data.reduce((acc: Array<number>, cell, index) => {
            const { x, y } = getTileCoordsByGid(cell, layer);
            acc[index * 4] = x;         // tile x on tilemap
            acc[index * 4 + 1] = 0;
            acc[index * 4 + 2] = 0;
            acc[index * 4 + 3] = y;     // tile y on tilemap 
            return acc;
        }, []);
        return new Uint8Array(data);
    }

    const getTileCoordsByGid = (cell: number, layerData: LayerData) => {
        if (cell === 0) { 
            return { x: -1, y: -1 };
        }
        const x =  (cell -1) % layerData.width;
        const y = Math.floor((cell - x) / layerData.height);

        return { x, y };
    }

    const getTileset = (map: MapData) => {
        if (!map.tilesets.length) {
            throw new Error("No tilesets found! Can't continue");
        }
        if (map.tilesets.length > 1) {
            console.warn("Found more than one tileset. But we currently only support one.");
        }
        return map.tilesets[0];
    }

//const tiledPath = 'https://regl-project.github.io/regl/www/gallery/assets/map.json'
const tilePath = 'https://regl-project.github.io/regl/www/gallery/assets/tiles.png'

    useEffect(() => {
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

        new PIXI.Loader().add([tiledPath]).load((loader)=>{
            
          const mapData: MapData = loader.resources[tiledPath].data;
          const basePath = path.dirname(tiledPath.replace(loader.baseUrl, ''));
          const mapWidth = mapData.width;
          const mapHeight =  mapData.height;
        
          // We only support one tileset at the moment. Have to figure out how to handle//]
          // multiple tiles

          const tileset = getTileset(mapData);
          const tileSize: Array<number> = [
              tileset.imagewidth / tileset.tilewidth,
              tileset.imageheight / tileset.tileheight,
          ];
          // All below is per layer!
          // note, the layers array order is depth sorting. first element in the array is lowest. last is highest
          const layer = mapData.layers[1];
          const mapSize = [mapWidth, mapHeight];
        //   console.log(parseLayer(layer));
          const map = PIXI.BaseTexture.fromBuffer(parseLayer(layer), mapWidth, mapHeight );
          const image = PIXI.Texture.from(`${basePath}/${tileset.image}`);
        //   console.log(map);
          image.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
          image.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;// MipMapModes. SCALE_MODESfalse;
        
          // make a shader..
          const shader = PIXI.Shader.from(vert, frag, {
              map,
              image,
              tileSize,                 // [nr_of_tiles_wide, nr_of_tiles_high] 
              mapSize,                  // [tiles_width, tiles_height]
              view: [0, 0, mapWidth, mapHeight]      // in tiles
          })

          // make a geometry..
          const geometry = new PIXI.Geometry()
          .addAttribute('position', [ -1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1 ]);
        

          const tileMesh = new PIXI.Mesh(geometry, shader); // todo: PixiComponent
          if(ref.current){ 
            (ref.current! as any).addChild(tileMesh);
          }
          
        
        // const sprite = new PIXI.Sprite(image);
        //   (ref.current! as any).addChild(sprite);
          
        });
    }, []);

    useTick((delta) => {
        // const boxX = mapWidth * x / app.screen.width
        // const boxY = mapHeight * y / app.screen.height
        // const boxH = 10
        // const boxW = app.screen.width / app.screen.height * boxH

        // shader.uniforms.view = [boxX - 0.5 * boxW,
        //     boxY - 0.5 * boxH,
        //     boxX + 0.5 * boxW,
        //     boxY + 0.5 * boxH]
    });
//   app.stage.interactive = true;

//   app.stage.mousemove = e => {
//       x = e.data.global.x * 0.5;
//       y = e.data.global.y * 0.6;
//   }

  // update tick..
//   app.ticker.add(()=>{

//       const boxX = mapWidth * x / app.screen.width
//       const boxY = mapHeight * y / app.screen.height
//       const boxH = 10
//       const boxW = app.screen.width / app.screen.height * boxH

//       shader.uniforms.view = [boxX - 0.5 * boxW,
//                               boxY - 0.5 * boxH,
//                               boxX + 0.5 * boxW,
//                               boxY + 0.5 * boxH]

//   })

//   app.renderer.resize(window.innerWidth, window.innerHeight);


// // resize with logo..
// window.addEventListener('resize', ()=>{

// //  app.renderer.resize(window.innerWidth, window.innerHeight);
// });

//const app = new PIXI.Application(window.innerWidth, window.innerHeight, {resolution:1, clearBeforeRender:false, autoResize:true, backgroundColor:0x333333})

//budo index.js --live -- -t babelify

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
            <Container
                ref={ref}
            >

            </Container>
    );
}

export default TileMap;