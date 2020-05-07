
import { Container } from '@inlet/react-pixi';
import React, { useMemo, forwardRef } from 'react';

interface Props  {
  tileWidth: number;
  tileHeight: number;
  location?: [number, number]; // tile coordinate space 
  children: React.ReactNode;
};

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneObject = forwardRef((props: Props, ref: React.Ref<PIXI.Container>) => {
    const { 
        location = [0, 0],
        tileWidth = 0, 
        tileHeight = 0,
        children
    } = props;

    const {x, y} = useMemo(() => {
        return { 
            x: location[0] * tileWidth,
            y: location[1] * tileHeight,
        };
    }, [location, tileWidth, tileHeight]);

    return (
        <Container x={x} y={y} ref={ref}>
            {children}
        </Container>
    )
});

export default SceneObject;
