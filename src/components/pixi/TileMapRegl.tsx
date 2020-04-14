import React, { useRef, useEffect } from "react";
import TiledMapContainer from 'components/tiled';
import { Stage, useApp, Container, useTick } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import path from 'path';

// todo: multiple layers 

// const Viewport = React.forwardRef<PixiViewport, any>((props, ref) => {

// const tiledPath = `${process.env.PUBLIC_URL}scenes/ork-dungeon-level1.tmx`;

// THIS works with the tilemap at regl-project.github.io
const TileMapRegl = () => {
    const app = useApp();
    const ref = useRef<Container>(null);

    const parseMap = (map: any) =>
    {
        var data = [];
        let count = 0;

        for (var i = 0; i < map.length; i++)
        {
            for (var j = 0; j < map[i].length; j++)
            {
                data[count++] = map[i][j][0];
                data[count++] = 0
                data[count++] = 0;
                data[count++] = map[i][j][1];
            }
        }

        return new Uint8Array( data );
    }

const jsonPath = 'https://regl-project.github.io/regl/www/gallery/assets/map.json'
const tilePath = 'https://regl-project.github.io/regl/www/gallery/assets/tiles.png'

    useEffect(() => {
        const frag = `
            precision mediump float;
            uniform sampler2D map, tiles;
            uniform vec2 mapSize, tileSize;
            varying vec2 uv;
            void main() {
                vec2 tileCoord = floor(255.0 * texture2D(map, floor(uv) / mapSize).ra);
                gl_FragColor = texture2D(tiles, (tileCoord + fract(uv)) / tileSize);
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

        new PIXI.Loader() 
            .add([jsonPath, tilePath])
            .load((out)=>{

          const mapData = out.resources[jsonPath].data;
          const mapWidth = mapData[0].length;
          const mapHeight =  mapData.length;
        
          const map = PIXI.BaseTexture.fromBuffer(  parseMap(mapData) , mapWidth, mapHeight );
        
          const tiles = PIXI.Texture.from(tilePath);
        
          tiles.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
          tiles.baseTexture.mipmap = PIXI.MIPMAP_MODES.OFF;// MipMapModes. SCALE_MODESfalse;
        
          // make a shader..
          const shader = PIXI.Shader.from(vert, frag, {
              map,
              tiles,
              tileSize: [16.0, 16.0],
              mapSize: [16.0, 16.0],
              view:[0,0,8,8]
          })
        
          // make a geometry..
          const geometry = new PIXI.Geometry()
          .addAttribute('position', [ -1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1 ]);
        
          const tileMesh = new PIXI.Mesh(geometry, shader);
          (ref.current! as any).addChild(tileMesh);
          // done.. add it to stage!
          //ref.current!.addChild(tileMesh);
          //app.stage.addChild(tileMesh);
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

export default TileMapRegl;