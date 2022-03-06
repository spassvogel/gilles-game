import { Container } from '@inlet/react-pixi';
import { useRef } from 'react';
import { AdventurerObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { Container as PixiContainer } from 'pixi.js';
import { useAdventurer } from 'hooks/store/adventurers';

interface Props  {
  actor: AdventurerObject;
  selected: boolean;
}

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children' | 'name' | 'health'>) => {
  const {
    controller,
    location,
    actor,
    selected,
    spritesheetPath,
  } = props;

  const ref = useRef<PixiContainer>(null);
  const adventurer = useAdventurer(actor.adventurerId);

  return (
    <Container ref={ref}>
      <SceneActor
        actor={actor}
        health={adventurer.health}
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
