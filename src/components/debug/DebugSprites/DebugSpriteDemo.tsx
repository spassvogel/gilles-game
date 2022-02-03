import SpriteAnimated from 'components/pixi/tile/SpriteAnimated';
import { Stage } from '@inlet/react-pixi';
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor';
import useFrames from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useFrames';
import { SPRITE_WIDTH } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/utils';
import { Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation';
import { useEffect, useRef, useState } from 'react';
import { AnimatedSprite } from 'pixi.js';

type Props = {
  spritesheetPath: string;
  animation: Animation;
  orientation: Orientation;
  currentFrame?: number;
};

const options = {
  autoDensity: true,
  sharedLoader: true,
};

const DebugSpriteDemo = (props: Props) => {
  const { spritesheetPath, animation, orientation, currentFrame } = props;
  const ref = useRef<AnimatedSprite>(null);
  
  const frames = useFrames(spritesheetPath, animation, orientation);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest);
  }, [orientation]);

  useEffect(() => {
    if (currentFrame) {
      console.log(currentFrame);
      ref.current?.gotoAndStop(currentFrame);
    }
  }, [currentFrame]);

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
        ref={ref}
      />
    </Stage>
  );
};

export default DebugSpriteDemo;
