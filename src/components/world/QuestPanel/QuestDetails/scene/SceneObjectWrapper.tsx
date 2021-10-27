
import { Container } from '@inlet/react-pixi';
import React, { useMemo, forwardRef, PropsWithChildren } from 'react';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { Container as PixiContainer } from 'pixi.js';

interface Props {
  controller: BaseSceneController<any>;
  location?: [number, number]; // tile coordinate space
}

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneObjectWrapper = forwardRef<PixiContainer, Props>((props: PropsWithChildren<Props>, ref) => {
  const {
    location = [0, 0],
    controller,
    children
  } = props;
  const tileWidth = controller.mapData?.tilewidth;
  const tileHeight = controller.mapData?.tileheight;

  const {x, y} = useMemo(() => {
    return {
      x: location[0] * (tileWidth ?? 1),
      y: location[1] * (tileHeight ?? 1),
    };
  }, [location, tileWidth, tileHeight]);

  return (
    <Container x={x} y={y} ref={ref}>
      {children}
    </Container>
  )
});

SceneObjectWrapper.displayName = 'SceneObjectWrapper'
export default SceneObjectWrapper;
