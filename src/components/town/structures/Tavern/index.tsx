import React from "react";
import { Props } from 'components/town/TownView';
import { Sprite } from '@inlet/react-pixi';
import { Structure } from 'definitions/structures';
import HitAreaShapes from 'utils/hitAreaShapes';
import polygons from './../hitAreas.json';
import smoke from './smoke.json';
import ParticleEmitter from 'components/pixi/ParticleEmitter';

const Tavern = (props: Props) => {
    const structure = Structure.tavern;
    const hitAreaShapes = new HitAreaShapes(polygons, structure);

    return (
        <Sprite 
            name={structure}
            x ={500}
            y ={469}
            interactive={true}
            buttonMode={true}
            pointertap={() => {
                props.onStructureClick(structure);
            }}
            hitArea={hitAreaShapes}
            image={`${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.png`}
        >
            <ParticleEmitter
                name="smoke"
                x={107}
                y={-2}
                image={`${process.env.PUBLIC_URL}/img/town/effects/smokeparticle.png`} 
                config={smoke} 
            />
        </Sprite>
    )
}
export default Tavern;