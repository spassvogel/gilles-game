import SpriteAnimated from 'components/pixi/tile/SpriteAnimated';
import { Stage } from '@inlet/react-pixi';
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor';
import useFrames from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useFrames';
import { SPRITE_WIDTH } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/utils';
import { Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation';
import { useEffect, useState } from 'react';

type Props = {
  spritesheetPath: string;
  animation: Animation;
  orientation: Orientation;
};

const options = {
  autoDensity: true,
  sharedLoader: true,
};

const DebugSpriteDemo = (props: Props) => {
  const { spritesheetPath, animation, orientation } = props;

  const frames = useFrames(spritesheetPath, animation, orientation);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest);
  }, [orientation]);

  return (
    <Stage options={options} width={SPRITE_WIDTH * 2} height={SPRITE_WIDTH * 2}>
      <SpriteAnimated
        animationSpeed={0.1}
        isPlaying={true}
        textures={frames}
        x={SPRITE_WIDTH}
        y={SPRITE_WIDTH}
        scale={[(flipped ? -1 : 1), 1]}
        anchor={[.5, .5]}
        pivot={[0, 0]}
      />
    </Stage>
  );
};

export default DebugSpriteDemo;
