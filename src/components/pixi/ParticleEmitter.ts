import { PixiComponent, applyDefaultProps, Container } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import * as particles from 'pixi-particles';

interface Props  {
    image: string;
    config: particles.OldEmitterConfig | particles.EmitterConfig;
}

interface InternalParticleEmitter {
  _emitter: particles.Emitter;
  _raf: number;
}

const ParticleEmitter = PixiComponent<Props & React.ComponentProps<typeof Container>, PIXI.ParticleContainer>("ParticleEmitter", {
    create() {
      return new PIXI.ParticleContainer(256, {});
    },

    applyProps(instance, oldProps: Props, newProps: Props) {
      const { image, config, ...newP } = newProps;

      // apply rest props to PIXI.ParticleContainer
      applyDefaultProps(instance, oldProps, newP);

      let emitter = (this as unknown as InternalParticleEmitter)._emitter;
      if (!emitter) {
        emitter = new particles.Emitter(
          instance,
          [PIXI.Texture.from(image)],
          config
        );

        let elapsed = performance.now();

        const tick = () => {
          (this as unknown as InternalParticleEmitter)._raf = requestAnimationFrame(tick);
          const now = performance.now();
          // const amp = Math.random() * 5 + 15;
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
      (this as unknown as InternalParticleEmitter)._emitter = emitter;
    },

    willUnmount() {
      if ((this as unknown as InternalParticleEmitter)._emitter) {
        (this as unknown as InternalParticleEmitter)._emitter.emit = false;
        cancelAnimationFrame((this as unknown as InternalParticleEmitter)._raf);
      }
    }
});

export default ParticleEmitter;