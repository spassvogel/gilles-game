import { Container } from '@inlet/react-pixi';
import { BaseSceneController, EVENT_SCENE_EFFECT } from 'mechanics/scenes/BaseSceneController';
import { useEffect, useRef } from 'react';
import { AnimatedSprite, Container as PixiContainer, Point, Loader } from 'pixi.js';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  controller: BaseSceneController<unknown>;
}


const SceneEffectLayer = (props: Props) => {
  const { controller } = props;

  const ref = useRef<PixiContainer>(null);
  useEffect(() => {
    const addEffect = (path: string, point: Point) => {
      const resource = Loader.shared.resources[path];
      const sheet = resource?.spritesheet;
      if (sheet?.animations) {
        const animatedSprite = new AnimatedSprite(sheet.animations.play);
        animatedSprite.x = point.x;
        animatedSprite.y = point.y;
        animatedSprite.animationSpeed = resource.data.meta.speed;
        animatedSprite.loop = false;
        animatedSprite.onComplete = () => {
          animatedSprite.destroy();
        };
        animatedSprite.gotoAndPlay(0);
        ref.current?.addChild(animatedSprite);
      }
    };
    controller?.addListener(EVENT_SCENE_EFFECT, addEffect);
    return () => {
      controller.removeListener(EVENT_SCENE_EFFECT, addEffect);
    };

  }, [controller]);

  return (
    <Container name="SceneEffectLayer" ref={ref}>

    </Container>
  );
};

export default SceneEffectLayer;
