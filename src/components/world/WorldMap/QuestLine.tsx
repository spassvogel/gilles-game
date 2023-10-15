import { Graphics } from '@pixi/react'
import { type Point } from 'pixi.js'

type Props = {
  positions: Point[]
}

const QuestLine = (props: Props) => {
  const { positions } = props
  if (props.positions.length > 2) {
    return <Graphics
      name="questline"
      x={0}
      y={0}
      draw={graphics => {
        graphics.lineStyle(3, 0xFF3300)
        graphics.moveTo(positions[0].x, positions[0].y)

        let i = 0
        for (i = 1; i < positions.length - 2; i++) {
          const xc = (positions[i].x + positions[i + 1].x) / 2
          const yc = (positions[i].y + positions[i + 1].y) / 2
          graphics.quadraticCurveTo(positions[i].x, positions[i].y, xc, yc)
        }
        graphics.quadraticCurveTo(positions[i].x, positions[i].y, positions[i + 1].x, positions[i + 1].y)
        graphics.endFill()
      }}
    />
  }
  return null
}

export default QuestLine
