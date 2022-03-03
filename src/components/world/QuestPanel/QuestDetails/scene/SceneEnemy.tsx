import { Container } from '@inlet/react-pixi';
import { ActorObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';

interface Props  {
  actor: ActorObject;
  selected: boolean;
}

// The enemy on the scene
const SceneEnemy = (props: Props & Omit<SceneActorProps, 'children' | 'name'>) => {
  const {
    controller,
    location,
    actor,
    selected,
    spritesheetPath,
  } = props;

  return (
    <Container>
      <SceneActor
        actor={actor}
        controller={controller}
        spritesheetPath={spritesheetPath}
        selectionColor={selected ? 0x8b0000 : undefined }
        location={location}
      />
    </Container>
  );
};

export default SceneEnemy;
