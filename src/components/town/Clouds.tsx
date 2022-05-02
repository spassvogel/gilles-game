import { useState } from 'react';
import { Sprite, useTick } from '@inlet/react-pixi';
import { sprites } from 'manifests/sprites';

interface Props {
  worldWidth: number;
  speed?: number;
}

const CLOUD_IMAGES = [
  sprites.TOWN_CLOUD_1,
  sprites.TOWN_CLOUD_2,
  sprites.TOWN_CLOUD_3,
];
const randomCloud = () => Math.floor(Math.random() * (CLOUD_IMAGES.length - 1));
const randomY = () => Math.random() * -300 - 200;

const Clouds = (props: Props) => {
  const { speed = 1 } = props;
  const [cloud, setCloud] = useState(randomCloud());
  const image = CLOUD_IMAGES[cloud];
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
};

export default Clouds;
