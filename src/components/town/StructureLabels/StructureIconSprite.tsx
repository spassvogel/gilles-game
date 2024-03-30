import { type ComponentProps } from 'react'
import { Sprite } from '@pixi/react'
import { type Structure } from 'definitions/structures'
import { getStructureIcon } from './utils/getStructureIcon'

type Props = {
  structure: Structure
}

const StructureIconSprite = (props: Props & ComponentProps<typeof Sprite>) => (
  <Sprite
    image={getStructureIcon(props.structure)}
    {...props}
  />
)
export default StructureIconSprite
