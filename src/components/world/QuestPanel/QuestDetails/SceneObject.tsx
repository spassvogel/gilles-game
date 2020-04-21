
import { Container } from '@inlet/react-pixi';
import React, { useMemo } from 'react';

interface Props  {
  tileWidth: number;
  tileHeight: number;
  sceneLocation?: number[]; // tile coordinate space 
  children: React.ReactNode;
};

const SceneObject = (props: Props) => {
    const { 
        sceneLocation = [0, 0],
        tileWidth = 0, 
        tileHeight = 0,
        children
    } = props;

    const { x, y} = useMemo(() => {
        return { 
            x: sceneLocation[0] * tileWidth,
            y: sceneLocation[1] * tileHeight,
        };
    }, [sceneLocation, tileWidth, tileHeight]);

    return (
        <Container x={x} y={y}>
            {children}
        </Container>
    )
}

export default SceneObject;
