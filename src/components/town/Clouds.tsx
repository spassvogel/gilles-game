import { useState } from 'react'
import { Sprite, useTick } from '@pixi/react'
import { defineAssetPath } from 'utils/assets'
import { sprites } from 'bundles/sprites'

type Props = {
  worldWidth: number
  speed?: number
}

const CLOUD_IMAGES = [
  sprites.town.CLOUD_1,
  sprites.town.CLOUD_2,
  sprites.town.CLOUD_3
]
const randomCloud = () => Math.floor(Math.random() * (CLOUD_IMAGES.length - 1))
const randomY = () => Math.random() * -300 - 200

const Clouds = (props: Props) => {
  const { speed = 1 } = props
  const [cloud, setCloud] = useState(randomCloud())
  const image = defineAssetPath(CLOUD_IMAGES[cloud])

  const [x, setX] = useState(-2000)
  const [y, setY] = useState(randomY())

  useTick((delta: number | undefined) => {
    if (x > props.worldWidth) {
      setX(2000 - Math.random() * 1000)
      setY(randomY())
      setCloud(randomCloud())
    } else {
      setX(x + speed * (delta ?? 1))
    }
  })
  return (
    <Sprite
      name="clouds"
      image={image}
      alpha={0.8}
      eventMode='none'
      interactiveChildren={false}
      interactive={false}
      x={x}
      y={y}
    />
  )
}

export default Clouds
