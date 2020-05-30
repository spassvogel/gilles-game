import React, { useState, useEffect } from 'react';
import { Structure } from 'definitions/structures';
import { Sprite, useApp, useTick } from '@inlet/react-pixi';
import HitAreaShapes from 'utils/hitAreaShapes';
import * as PIXI from 'pixi.js';
import { ITextureDictionary } from 'pixi.js';
import { STRUCTURE_HIGHLIGHT_FILTER } from 'components/town/TownView';

const BLADE_ROTATION_SPEED = 0.01;

export interface Props {
    onStructureClick: (structure: Structure | null) => void;
    position: PIXI.Point;
    selected?: boolean;
    hitAreaShapes: HitAreaShapes;
}

const LumberMill = (props: Props) => {
    const {hitAreaShapes} = props;
    const structure = Structure.lumberMill;
    const atlas = `${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.json`;
    const [textures, setTextures] = useState<ITextureDictionary>();
    const filters = props.selected ? [STRUCTURE_HIGHLIGHT_FILTER] : [];

    const app = useApp();

    useEffect(() => {
        if (!app.loader.resources[atlas]) {
            app.loader.add(atlas).load((_, resources) => {
                setTextures(resources[atlas]?.textures);    
            });
        } else {
            setTextures(app.loader.resources[atlas]?.textures);
        }
    }, [app, app.loader, atlas]);

    const [rotation, setRotation] = useState(0);
    useTick((delta:number | undefined) => setRotation(r => r + (BLADE_ROTATION_SPEED * delta!)));


    if (!textures) return null;
    return (
        <Sprite 
            name={structure}
            position={props.position}
            interactive={true}
            buttonMode={true}
            pointertap={() => {
                props.onStructureClick(structure);
            }}
            hitArea={hitAreaShapes}
            filters={filters}
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