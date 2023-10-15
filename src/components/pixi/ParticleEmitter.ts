import { type ComponentProps } from 'react'
import { PixiComponent, applyDefaultProps, type Container } from '@pixi/react'
import * as PIXI from 'pixi.js'
import * as particles from '@pixi/particle-emitter'
import { upgradeConfig } from '@pixi/particle-emitter'

type Props = {
  image: string
  config: particles.EmitterConfigV1
}

const ParticleEmitter = PixiComponent<Props & ComponentProps<typeof Container>, PIXI.ParticleContainer>('ParticleEmitter', {
  create: () => new PIXI.ParticleContainer(256, {}),

  applyProps: (instance, oldProps: Props, newProps: Props) => {
    const { image, config, ...newP } = newProps

    // apply rest props to PIXI.ParticleContainer
    applyDefaultProps(instance, oldProps, newP)

    const newConfig = upgradeConfig(config, [PIXI.Texture.from(image)])
    const emitter = new particles.Emitter(
      instance,
      newConfig
    )

    let elapsed = performance.now()

    const tick = () => {
      if (instance.destroyed) {
        return
      }

      const now = performance.now()
      // const amp = Math.random() * 5 + 15;
      // const amp = 15;
      // const freq = 0.0015;
      // emitter.acceleration.x = (Math.sin((elapsed * freq)) * amp) + 15;

      emitter.update((now - elapsed) * 0.0003)

      elapsed = now
      requestAnimationFrame(tick)
    }
    emitter.emit = true
    // emitter.update(00.2);

    tick()
  }
})

export default ParticleEmitter
