import { useMemo,  useEffect, useRef, PropsWithChildren, useState, memo, ComponentProps } from 'react';
import { Location } from 'utils/tilemap';
import { Container } from '@inlet/react-pixi';
import { Filter, Container as PixiContainer } from 'pixi.js';
import { ActorObject } from 'store/types/scene';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import SpriteAnimated from 'components/pixi/tile/SpriteAnimated';
import { AdventurerColor } from 'store/types/adventurer';
import { useQuest } from 'hooks/store/quests';
import ActorStats from './ActorStats';
import { useRandomOrientation } from './useRandomOrientation';
import { BLACK, BLUES, calculateBearing, createColorReplaceFilter, ORANGE, Orientation, PURPLE, REDS, SPRITE_WIDTH, TEALS, WHITE, YELLOW } from './utils';
import useAnimation from './useAnimation';
import useFrames from './useFrames';

export interface Props  {
  actor: ActorObject;
  spritesheetPath: string;
  color?: AdventurerColor;
  controller: BaseSceneController<unknown>;
  location?: Location; // tile coordinate space
  lookAt?: Location;
  idleAnimation?: boolean;  // Only when lookAt is undefined, will randomly turn around
}

// This is a wrapper that exposes a location property. Will set x and y on children
const SceneActor = (props: PropsWithChildren<Props> & ComponentProps<typeof Container>) => {
  const {
    location = [0, 0],
    controller,
    idleAnimation,
    color,
    children,
    spritesheetPath,
    lookAt,
    actor,
    ...rest
  } = props;
  const { tileWidth, tileHeight } = controller.getTileDimensions();
  const actorRef = useRef<PixiContainer>(null);
  const quest = useQuest(props.controller.questName);

  const [orientation, setOrientation] = useState<Orientation>(Orientation.north);
  const animation = useAnimation(controller, actorRef, actor.name, location, setOrientation);
  useRandomOrientation(!!idleAnimation && !lookAt, orientation, setOrientation);

  const frames = useFrames(spritesheetPath, animation, orientation);

  const { x, y } = useMemo(() => {
    return {
      x: location[0] * tileWidth,
      y: location[1] * tileHeight,
    };
  }, [location, tileWidth, tileHeight]);

  const [flipped, setFlipped] = useState(false);
  // const flipped = useRef(false);
  // const setFlipped = (value:boolean) => {
  //   flipped.current = value;
  // };

  useEffect(() => {
    if (lookAt !== undefined) {
      const bearing = calculateBearing(location, lookAt);
      setOrientation(bearing);
    }
  }, [location, lookAt]);

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest);
  }, [orientation]);

  const scale = useMemo(() => {
    return [(flipped ? -1 : 1), 1] as [number, number];
  }, [flipped]);

  const filters = useMemo<Filter[]>(() => {
    switch (color) {
      case AdventurerColor.black:
        return [createColorReplaceFilter(BLUES, BLACK)];
      case AdventurerColor.orange:
        return [createColorReplaceFilter(BLUES, ORANGE)];
      case AdventurerColor.purple:
        return [createColorReplaceFilter(BLUES, PURPLE)];
      case AdventurerColor.red:
        return [createColorReplaceFilter(BLUES, REDS)];
      case AdventurerColor.teal:
        return [createColorReplaceFilter(BLUES, TEALS)];
      case AdventurerColor.white:
        return [createColorReplaceFilter(BLUES, WHITE)];
      case AdventurerColor.yellow:
        return [createColorReplaceFilter(BLUES, YELLOW)];
      default:
        return [];
    }
  }, [color]);
  const showThingy = !!quest.scene?.combat;
  return (
    <Container x={x} y={y} ref={actorRef} {...rest}>
      { spritesheetPath && frames && (
        <SpriteAnimated
          animationSpeed={0.1}
          name={`${actor.id}-sprite`}
          isPlaying={true}
          textures={frames}
          x={SPRITE_WIDTH / 4}
          y={20}
          scale={scale}
          anchor={[.5, .5]}
          pivot={[0, 0]}
          filters={filters}
        />
      )}
      {children}
      {showThingy && (
        <ActorStats tileWidth={tileWidth} actor={actor} />
      )}
    </Container>
  );
};

export default memo(SceneActor);
