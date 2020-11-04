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
            <Segment position="w" />
            <Segment position="sw" />
            <Segment position="s" />
            <Segment position="se" />
            <Segment position="e" />
        </div>
    )
}

export default CombatUIWidget;
