import { PixiComponent, applyDefaultProps, AnimatedSprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const scaleChanged = (oldScale: [number, number], newScale: [number, number]) => {
  if (!oldScale || !newScale) return true;
  return oldScale[0] != newScale[0] || oldScale[1] != newScale[1];
};

const SpriteAnimated = PixiComponent<React.ComponentProps<typeof AnimatedSprite>, PIXI.AnimatedSprite>('SpriteAnimated', {
  create: ({ textures, name }) => {
    if (!textures?.[0]) {
      console.warn(`Something went wrong with ${name}`);
    }
    const animatedSprite = new PIXI.AnimatedSprite(textures || [], true);
    return animatedSprite;
  },
  applyProps: (instance, oldProps, newProps) => {
    if (oldProps.textures !== newProps.textures
      || scaleChanged(oldProps.scale as [number, number], newProps.scale as [number, number])) {
      applyDefaultProps(instance, oldProps, newProps);
      instance.gotoAndPlay(0);
    }
  },
});

// export default memo(SpriteAnimated);
export default SpriteAnimated;

