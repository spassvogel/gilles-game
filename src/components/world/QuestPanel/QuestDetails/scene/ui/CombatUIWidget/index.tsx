import React, { useEffect, useState } from 'react';
import Segment from './Segment';
import "./styles/combatUIWidget.scss";

interface Props {
    location: [number, number];
}

const CombatUIWidget = (props: Props) => {
    const {location} = props;
    const [rot, setRot] = useState(0);
    const segmentWidth = 32;
    const segmentHeight = 46;
    const tileWidth = 100;
    const tileHeight = 100;
    const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;

    // const rotate = true;
    // useEffect(() => {
    //     if (rotate){
    //         setTimeout(() => {
    //             console.log(rot)
    //             setRot(rot + 1)   
    //         }, 3)
    //     }

    // }, [rot]);

    return (
        <div 
            className="combat-ui-widget" 
            style={{ transform }}
        >
            <Segment position="w" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/knife-thrust.svg`}/>
            <Segment position="sw" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/high-shot.svg`}/>
            <Segment position="s" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/walking-boot.svg`}/>
            <Segment position="se" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/sunken-eye.svg`}/>
            <Segment position="e" icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/crosshair.svg`}/>
        </div>
    )
}

export default CombatUIWidget;
