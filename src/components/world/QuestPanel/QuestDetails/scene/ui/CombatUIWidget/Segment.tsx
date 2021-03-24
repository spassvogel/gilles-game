import React, { useMemo } from 'react';

interface Props {
    position: "w" | "sw" | "s" | "se" | "e";
    icon?: string;
    activated: boolean;
    tileHeight: number;

    onActivate?: () => void;
    onDeactivate?: () => void;
}

const Segment = (props: Props) => {
    const {icon, onActivate, onDeactivate, tileHeight, activated} = props;
    const segmentWidth = 32;
    const segmentHeight = 46;
    const rot = useMemo(() => {
        switch (props.position) {
            case "w": return 180;
            case "sw": return 135;
            case "s": return 90;
            case "se": return 45;
            default: return 0;
        }
    }, [props.position]);

    const scale = activated ? 'scale(2)' : 'scale(1.5)';
    const style = {
        transform: `translate(${segmentWidth/2}px, ${tileHeight/2 - segmentHeight/2}px) ${scale} rotate(${rot}deg) translateX(${activated ? 27 : 35}px)`,
        background: `url(${process.env.PUBLIC_URL}/img/scene/ui/combat/ring-segment.svg)`,
        width: segmentWidth,
        height: segmentHeight,
        ...(activated && { zIndex: 2})
    }

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
                    width: segmentWidth - 8
                }}
                alt=""
            />
        </div>
    )
}

export default Segment;


