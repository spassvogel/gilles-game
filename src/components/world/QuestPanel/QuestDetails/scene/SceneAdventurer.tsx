import { Container } from '@inlet/react-pixi';
import { useRef } from 'react';
import { AdventurerObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { Container as PixiContainer, Loader } from 'pixi.js';
import { useAdventurer } from 'hooks/store/adventurers';
import { sprites } from 'manifests/sprites';

interface Props  {
  actor: AdventurerObject;
  selected: boolean;
}

// The adventurers avatar on the scene
const SceneAdventurer = (props: Props & Omit<SceneActorProps, 'children' | 'name' | 'health' | 'spritesheet'>) => {
  const {
    controller,
    location,
    actor,
    selected,
  } = props;

  const ref = useRef<PixiContainer>(null);
  const adventurer = useAdventurer(actor.adventurerId);
  const { health, spritesheet: key } = adventurer;
  const spritesheet = Loader.shared.resources[sprites[key]].spritesheet;
  if (spritesheet === undefined) return null;

  return (
    <Container ref={ref} zIndex={health}>
      <SceneActor
        actor={actor}
        health={adventurer.health}
        controller={controller}
        spritesheet={spritesheet}
        location={location}
        selectionColor={selected ? 0xffffff : undefined }
        idleAnimation={Math.random() < 0.5}
      />
    </Container>
  );
};

export default SceneAdventurer;
