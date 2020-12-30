import React, { useMemo } from 'react';

interface Props {
    position: "w" | "sw" | "s" | "se" | "e";
    icon?: string;
    activated: boolean;
    onActivate?: () => void;
    onDeactivate?: () => void;
}

const Segment = (props: Props) => {
    const {icon, onActivate, onDeactivate, activated} = props;
    const segmentWidth = 32;
    const segmentHeight = 46;
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

    const scale = activated ? 'scale(1.2)' : '';
    const style = {
        transform: `translate(${segmentWidth}px, ${tileHeight/2 - segmentHeight/2}px) ${scale} rotate(${rot}deg) translateX(${activated ? 36 : 44}px)`,
        background: `url(${process.env.PUBLIC_URL}/img/scene/ui/combat/ring-segment.svg)`,
        width: segmentWidth,
        height: segmentHeight,
        zIndex: activated ? "2" : "initial"
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
            // @ts-ignore (todo: zIndex typing error?)
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


