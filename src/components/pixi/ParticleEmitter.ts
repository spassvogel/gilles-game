import { PixiComponent, applyDefaultProps } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import * as particles from 'pixi-particles';

interface Props {
    image: string;
    config: particles.OldEmitterConfig | particles.EmitterConfig;
}

// todo: Do I really have to do all this stuff?
type PointLike = PIXI.Point | PIXI.ObservablePoint | [number, number] | [number] | number;
type WithPointLike<T extends keyof any> = { [P in T]: PointLike };
type InteractionEvents = {
  [P in PIXI.interaction.InteractionEventTypes]?: (event: PIXI.interaction.InteractionEvent) => void;
};
type Container<T extends PIXI.DisplayObject> = Partial<Omit<T, 'children'>> &
Partial<WithPointLike<'position' | 'scale' | 'pivot' | 'anchor'>> &
InteractionEvents;
type IContainer = Container<PIXI.Container>;

const ParticleEmitter = PixiComponent<Props & IContainer, PIXI.ParticleContainer>("ParticleEmitter", {
    create() {
      return new PIXI.ParticleContainer();
    },

    applyProps(instance, oldProps: Props, newProps: Props) {
      const { image, config, ...newP } = newProps;
  
      // apply rest props to PIXI.Container
      applyDefaultProps(instance, oldProps, newP);
      
      let emitter = (this as any)._emitter;
      if (!emitter) {
        emitter = new particles.Emitter(
          instance,
          [PIXI.Texture.from(image)],
          config
        );
  
        let elapsed = performance.now();
  
        const tick = () => {
          emitter.raf = requestAnimationFrame(tick);
          const now = performance.now();
          //const amp = Math.random() * 5 + 15;
          // const amp = 15;
          // const freq = 0.0015;
          // emitter.acceleration.x = (Math.sin((elapsed * freq)) * amp) + 15;

          emitter.update((now - elapsed) * 0.0003);
  
          elapsed = now;
        };  
        emitter.emit = true;
        // emitter.update(00.2);

        tick();
      }
      (this as any)._emitter = emitter;
    },

    willUnmount() {
      if ((this as any)._emitter) {
        (this as any)._emitter.emit = false;
        cancelAnimationFrame((this as any)._emitter.raf);
      }
    }
});

export default ParticleEmitter;