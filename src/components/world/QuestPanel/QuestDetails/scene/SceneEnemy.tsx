import { Container } from '@inlet/react-pixi';
import { Loader } from 'pixi.js';
import { EnemyObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';
import { getDefinition as getEnemyDefinition } from 'definitions/enemies';
import { EnemyType } from 'definitions/enemies/types';
import { sprites } from 'manifests/sprites';

interface Props  {
  actor: EnemyObject;
  selected: boolean;
}

// The enemy on the scene
const SceneEnemy = (props: Props & Omit<SceneActorProps, 'children' | 'name' | 'health' | 'spritesheet'>) => {
  const {
    controller,
    location,
    actor,
    selected,
  } = props;
  const { health } = actor;
  const definition = getEnemyDefinition(actor.properties.enemyType as EnemyType);
  const key = definition.spritesheet;
  const spritesheet = Loader.shared.resources[sprites[key]].spritesheet;
  if (spritesheet === undefined) return null;

  return (
    <Container zIndex={health}>
      <SceneActor
        actor={actor}
        health={actor.health}
        controller={controller}
        spritesheet={spritesheet}
        selectionColor={selected ? 0x8b0000 : undefined }
        location={location}
      />
    </Container>
  );
};

export default SceneEnemy;
