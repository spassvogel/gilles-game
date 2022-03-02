import { Container } from '@inlet/react-pixi';
import { isAdventurer, isEnemy, SceneObject } from 'store/types/scene';
import SceneAdventurer from '../SceneAdventurer';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { TiledObjectType } from 'utils/tilemap';
import SceneActor from '../SceneActor';

interface Props {
  objects: SceneObject[];
  controller: BaseSceneController<unknown>;
  selectedActorId: string;
}

const ObjectSpriteLayer = (props: Props) => {
  const { objects, controller } = props;

  return (
    <Container>
      {objects.map((object) => {
        const { location } = object;
        const { adventurerId, spritesheet } = object.properties as { [key: string]: string };
        switch (object.type) {
          case TiledObjectType.actor: {
            if (isAdventurer(object)) {
              return (
                <SceneAdventurer
                  location={location}
                  controller={controller}
                  actor={object}
                  key={adventurerId}
                  spritesheetPath={spritesheet}
                  selected={props.selectedActorId === object.adventurerId }
                />
              );
            } else if (isEnemy(object)) {
              return (
                <SceneActor
                  actor={object}
                  controller={controller}
                  spritesheetPath={spritesheet}
                  location={location}
                  key={object.enemyId}
                  idleAnimation={Math.random() < 0.5}
                  lookAt={[4, 3]}
                />
              );
            }
            break;
          }
          default:
            return null;
        }
        return null;
      })}
    </Container>
  );
};

export default ObjectSpriteLayer;
