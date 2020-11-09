import React, { useEffect, useMemo, useState } from 'react';

interface Props {
    position: "w" | "sw" | "s" | "se" | "e";
    icon?: string;
    onActivate?: () => void;
    onDeactivate?: () => void;
}

const Segment = (props: Props) => {
    const {icon, onActivate, onDeactivate} = props;
    const segmentWidth = 32;
    const segmentHeight = 46;
    const tileWidth = 100;
    const tileHeight = 100;
    const rot = useMemo(() => {
        switch (props.position) {
            case "w": return 180;
            case "sw": return 135;
            case "s": return 90;
            case "se": return 45;
            default: return 0;
        }
    }, [props.position]);

    const style = {
        transform: `translate(${segmentWidth}px, ${tileHeight/2 - segmentHeight/2}px) rotate(${rot}deg) translateX(44px)`, //44
        background: `url(${process.env.PUBLIC_URL}/img/scene/ui/combat/ring-segment.svg)`,
        width: segmentWidth,
        height: segmentHeight
    }

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
            style={style}
            className="segment"
            onMouseOver={onActivate}
            onMouseOut={onDeactivate}
        >
            <img
                src={icon}
                style={{
                    transform: `rotate(-${rot}deg)`,
                    width: segmentWidth - 4
                }}
                alt=""
            />
        </div>
    )
}

export default Segment;


