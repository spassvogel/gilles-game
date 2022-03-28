import { Container } from '@inlet/react-pixi';
import { EnemyObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';

interface Props  {
  actor: EnemyObject;
  selected: boolean;
}

// The enemy on the scene
const SceneEnemy = (props: Props & Omit<SceneActorProps, 'children' | 'name' | 'health'>) => {
  const {
    controller,
    location,
    actor,
    selected,
    spritesheetPath,
  } = props;
  const { health } = actor;

  return (
    <Container zIndex={health}>
      <SceneActor
        actor={actor}
        health={actor.health}
        controller={controller}
        spritesheetPath={spritesheetPath}
        selectionColor={selected ? 0x8b0000 : undefined }
        location={location}
      />
    </Container>
  );
};

export default SceneEnemy;
