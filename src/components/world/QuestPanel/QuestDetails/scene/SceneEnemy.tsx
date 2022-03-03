import { Container, Graphics } from '@inlet/react-pixi';
import { ActorObject } from 'store/types/scene';
import SceneActor, { Props as SceneActorProps } from './SceneActor';

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
  const { tileWidth, tileHeight } = controller.getTileDimensions();

  return (
    <Container>
      <SceneActor
        actor={actor}
        controller={controller}
        spritesheetPath={spritesheetPath}
        location={location}
      >
        {selected && (
          <Graphics
            name="selectioncircle"
            draw={graphics => {
              const line = 3;
              graphics.lineStyle(line, 0x8b0000);
              graphics.drawCircle(tileWidth / 2, tileHeight / 2, tileWidth / 2 - line);
              graphics.endFill();
            }}
          />
        )}
      </SceneActor>
    </Container>
  );
};

export default SceneAdventurer;
