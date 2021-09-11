import { PixiComponent, applyDefaultProps, AnimatedSprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const SpriteAnimated = PixiComponent<React.ComponentProps<typeof AnimatedSprite>, PIXI.AnimatedSprite>('SpriteAnimated', {
  create: ({ textures, name }) => {
    if (!textures?.[0]) {
      console.warn(`Something went wrong with ${name}`)
    }
    const animatedSprite = new PIXI.AnimatedSprite(textures || [], true);
    return animatedSprite;
  },
  applyProps: (instance, oldProps, newProps) => {
    if(oldProps.textures !== newProps.textures){
      applyDefaultProps(instance, oldProps, newProps);
      instance.gotoAndPlay(0);
    }
  },
});

// export default memo(SpriteAnimated);
export default SpriteAnimated;

