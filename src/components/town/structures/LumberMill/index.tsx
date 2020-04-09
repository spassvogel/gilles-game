import React, { useState, useEffect, useRef } from 'react';
import { Structure } from 'definitions/structures';
import { Sprite, useApp, useTick } from '@inlet/react-pixi';
import HitAreaShapes from 'utils/hitAreaShapes';
import polygons from './../hitAreas.json';
import * as PIXI from 'pixi.js';
import { ITextureDictionary, LoaderResource } from 'pixi.js';
import { Props } from 'components/town/TownView';


const BLADE_ROTATION_SPEED = 0.01;

const LumberMill = (props: Props) => {
    const structure = Structure.lumberMill;
    const atlas = `/img/town/town-alpha/${structure}.json`;
    const hitAreaShapes = new HitAreaShapes(polygons, structure);
    const [textures, setTextures] = useState<ITextureDictionary>();

    const app = useApp();
    const [resource, setResource] = useState<LoaderResource>(app.loader.resources?.[atlas]);

    //const resource = app.loader.resources?.[atlas];
    useEffect(() => {
        console.log("checking cache" , app.loader.resources, app.loader.resources.length, app.loader.resources[atlas])
        //if (app?.loader.resources[atas]?.textures) {
            // have to load!
          //  console.log('have to load');
            app.loader.add(atlas).load((_, resources) => {
                //console.log(resources[atlas])
                setTextures(resources[atlas]?.textures);
                console.log("checking cache2" , app.loader.resources[atlas])
    
            });
        //}
    }, [app, app.loader, atlas]);

    const [rotation, setRotation] = useState(0);
    useTick((delta:number | undefined) => setRotation(r => r + (BLADE_ROTATION_SPEED * delta!)));


    if (!textures) return null;
    return (
        <Sprite 
            name={structure}
            x={403}
            y={320}
            interactive={true}
            buttonMode={true}
            pointertap={() => {
                props.onStructureClick(structure);
            }}
            hitArea={hitAreaShapes}
            texture={textures["structure.png"]}
        >
            <Sprite 
                name="blades"
                texture={textures["blades.png"]}
                anchor={new PIXI.Point(0.5, 0.5)}
                x={15}
                y={10}
                rotation={rotation}
            /> 
        </Sprite>        
    )
}

export default LumberMill;