
import { PixiComponent, Sprite, applyDefaultProps, Container } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import React, { useMemo } from 'react';

interface Props  {
  tileWidth: number;
  tileHeight: number;
  scenePosition?: number[];
  children: React.ReactNode;
};

const SceneObject = (props: Props) => {
    const { 
        scenePosition = [0, 0],
        tileWidth = 0, 
        tileHeight = 0,
        children
    } = props;

    const { x, y} = useMemo(() => {
        return { 
            x: scenePosition[0] * tileWidth,
            y: scenePosition[1] * tileHeight,
        };
    }, [scenePosition, tileWidth, tileHeight]);

    return (
        <Container x={x} y={y}>
            {children}
        </Container>
    )
}

export default SceneObject;
