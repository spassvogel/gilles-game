import { useMemo,  useEffect, useRef, useCallback, PropsWithChildren, useState, memo, ComponentProps } from 'react';
import { Location } from 'utils/tilemap';
import { Container } from '@inlet/react-pixi';
import { Filter, Loader, Texture, Container as PixiContainer } from 'pixi.js';
import { ActorObject } from 'store/types/scene';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import SpriteAnimated from 'components/pixi/tile/SpriteAnimated';
import { AdventurerColor } from 'store/types/adventurer';
import { useQuest } from 'hooks/store/quests';
import ActorStats from './ActorStats';
import { useRandomOrientation } from './useRandomOrientation';
import { BLACK, BLUES, calculateBearing, createColorReplaceFilter, ORANGE, Orientation, PURPLE, REDS, SPRITE_WIDTH, TEALS, WHITE, YELLOW } from './utils';
import useAnimation from './useAnimation';

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

  const [frames, setFrames] = useState<{ [key: string]: Texture[] } | null>(null);


  const { x, y } = useMemo(() => {
    return {
      x: location[0] * tileWidth,
      y: location[1] * tileHeight,
    };
  }, [location, tileWidth, tileHeight]);

  useEffect(() => {
    if (!spritesheetPath) return;

    if (!Loader.shared.resources[spritesheetPath]?.textures){
      throw new Error(`No textures for ${spritesheetPath}`);
    }
    const allFrames = Object.keys(Loader.shared.resources[spritesheetPath].textures ?? {});
    const indexed = allFrames.reduce((acc: { [key: string]: Texture[] }, frame: string) => {
      // frames are in the format of: 'stand-n', 'walk0-ne', 'walk1-ne' etc
      // create a mapping with arrays keyed by the part without the number,
      // eg: 'stand-n': [TEXTURE:stand-n] and 'walk-ne': [TEXTURE:walk0-ne, TEXTURE:walk1-ne]
      const key = frame.replace(/[0-9]/g, '');
      if (!acc[key]) {
        acc[key] = [];
      }
      const texture = Loader.shared.resources[spritesheetPath].textures?.[frame];
      if (texture) acc[key].push(texture);
      return acc;
    }, {});
    setFrames(indexed);
  }, [spritesheetPath]);

  // const [flipped, setFlipped] = useState(false);
  const flipped = useRef(false);
  const setFlipped = (value:boolean) => {
    flipped.current = value;
  };

  useEffect(() => {
    if (lookAt !== undefined) {
      const bearing = calculateBearing(location, lookAt);
      setOrientation(bearing);
    }
  }, [location, lookAt]);

  useEffect(() => {
    setFlipped(orientation === Orientation.southWest || orientation === Orientation.west || orientation === Orientation.northWest);
  }, [orientation]);

  const getFrames = useCallback(() => {
    const spritesheet = Loader.shared.resources[spritesheetPath];
    // Prefix all animations with the name of the image (without the extension) and a hyphen
    // So `orc-axe-walk0-n`, `skeleton-attack1-e`
    const prefix = `${spritesheet.data.meta.image.substring(0, spritesheet.data.meta.image.lastIndexOf('.'))}-`;
    switch (orientation) {
      case Orientation.northWest:
        return `${prefix}${animation}-${Orientation.northEast}`;
      case Orientation.west:
        return `${prefix}${animation}-${Orientation.east}`;
      case Orientation.southWest:
        return `${prefix}${animation}-${Orientation.southEast}`;
      default:
        return `${prefix}${animation}-${orientation}`;
    }
  }, [animation, orientation, spritesheetPath]);

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
          textures={frames[getFrames()]}
          x={SPRITE_WIDTH / 4}
          y={20}
          scale={[(flipped.current ? -1 : 1), 1]}
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
