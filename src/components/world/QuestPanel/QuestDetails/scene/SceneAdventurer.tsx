import { Container, Graphics } from '@inlet/react-pixi';
import React, { useRef, memo } from 'react';
import { ActorObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { Container as PixiContainer } from 'pixi.js';

interface Props  {
  actor: ActorObject;
  selected: boolean;
  spritesheetPath: string;
}

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children'|'name'>) => {
  const {
    controller,
    location,
    actor,
    selected,
    spritesheetPath,
  } = props;
  const {tileWidth, tileHeight} = controller.getTileDimensions();

  const ref = useRef<PixiContainer>(null);

  return (
    <Container ref={ref}>
      <SceneActor
        actor={actor}
        controller={controller}
        spritesheetPath={spritesheetPath}
        location={location}
        idleAnimation={Math.random() < 0.5}
      >
        {selected && (
          <Graphics
            name="selectioncircle"
            draw={graphics => {
              const line = 3;
              graphics.lineStyle(line, 0xFFFFFF);
              graphics.drawCircle(tileWidth / 2, tileHeight / 2, tileWidth / 2 - line);
              graphics.endFill();
            }}
          />
        )}
      </SceneActor>
    </Container>
  )
}

export default memo(SceneAdventurer);
