import { Container, Graphics, Text } from '@pixi/react'
import { type TextStyle } from 'pixi.js'
import { type ActorObject } from 'store/types/scene'

type Props = {
  actor: ActorObject
  tileWidth: number
}

const MARGIN = 4

// const useActorStatsInfo = (actor: ActorObject) => {
//   const adventurer = useAdventurer(actor.name) // is possibly null
//   if (actor.allegiance === Allegiance.player) {
//     return adventurer.name
//   }
//   return actor.name // enemy name
// }

const ActorStats = (props: Props) => {
  const { tileWidth, actor } = props

  // const mask = useRef<PIXI.Graphics>(null)
  // const name = useActorStatsInfo(actor)
  return (
    <Container y={-40}>
      <Text
        y={-10}
        x={MARGIN}
        anchor={[0, 1]}
        text={`${name} (${actor.ap})`}
        style={{
          fontFamily: 'Gabriela',
          fontSize: 18,
          fill: 0xffffff,
          align: 'center',
          wordWrap: true,
          wordWrapWidth: tileWidth,
          dropShadow: true,
          dropShadowAngle: 0.9,
          dropShadowBlur: 10,
          dropShadowDistance: 0
        } as unknown as TextStyle}
        // mask={mask.current}
      />
      {/* <Graphics
        name="mask"
        ref={mask}
        draw={mask => {
          mask.beginFill (0x003c1b)
          mask.drawRect(MARGIN, -30, tileWidth - 2 * MARGIN, 22)
          mask.endFill()
        }}
      /> */}
      {/* healthbar */}
      <Graphics
        name="background"
        draw={graphics => {
          graphics.beginFill(0x003c1b)
          graphics.drawRect(0, 0, tileWidth, 6)
          graphics.endFill()
        }}
      />
      <Graphics
        name="foreground"
        draw={graphics => {
          graphics.beginFill(0x006b22)
          graphics.drawRect(0, 0, 3/* actor.health */, 6)
          graphics.endFill()
        }}
      />
    </Container>
  )
}

export default ActorStats
