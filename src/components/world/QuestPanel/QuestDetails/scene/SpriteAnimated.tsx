import { PixiComponent, applyDefaultProps, AnimatedSprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';
import { memo } from 'react';

const SpriteAnimated = PixiComponent<React.ComponentProps<typeof AnimatedSprite>, PIXI.AnimatedSprite>('SpriteAnimated', {
create: ({ textures }) => {
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

export default memo(SpriteAnimated);

