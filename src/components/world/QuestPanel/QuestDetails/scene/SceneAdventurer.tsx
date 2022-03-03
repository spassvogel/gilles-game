import { Container } from '@inlet/react-pixi';
import { useRef } from 'react';
import { ActorObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { Container as PixiContainer } from 'pixi.js';

interface Props  {
  actor: ActorObject;
  selected: boolean;
}

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children' | 'name'>) => {
  const {
    controller,
    location,
    actor,
    selected,
    spritesheetPath,
  } = props;

  const ref = useRef<PixiContainer>(null);

  return (
    <Container ref={ref}>
      <SceneActor
        actor={actor}
        controller={controller}
        spritesheetPath={spritesheetPath}
        location={location}
        selectionColor={selected ? 0xffffff : undefined }
        idleAnimation={Math.random() < 0.5}
      />
    </Container>
  );
};

export default SceneAdventurer;
