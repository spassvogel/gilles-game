import { Sprite, useTick } from '@inlet/react-pixi';
import React, { useState } from 'react';

interface Props {
    worldWidth: number;
    speed?: number;
}

const Clouds = (props: Props) => {
    const { speed = 1 } = props;
    const [cloud, setCloud] = useState(randomCloud());
    const image = `${process.env.PUBLIC_URL}/img/town/clouds/cloud-0${cloud}.png`;
    const [x, setX] = useState(-2000);
    const [y, setY] = useState(randomY());

    useTick((delta:number | undefined) => {
        if (x > props.worldWidth){
            setX(2000 - Math.random() * 1000);
            setY(randomY());
            setCloud(randomCloud());
        } else {
            setX(x + speed * (delta || 1));
        }
    });

    return (
        <Sprite
            // name={`cloud ${cloud}`}
            image={image}
            alpha={0.8}
            x={x}
            y={y}
        />
    );
}

export default Clouds;

const randomCloud = () => Math.floor(Math.random() * 2) + 1;
const randomY = () => Math.random() * -300 - 200;