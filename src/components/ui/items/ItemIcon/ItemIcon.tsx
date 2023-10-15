import { type ItemSource } from 'constants/items'
import { getDefinition } from 'definitions/items'
import { type Item } from 'definitions/items/types'
import { TooltipManager } from 'global/TooltipManager'
import Icon, { type IconSize } from 'components/ui/common/Icon'
import { getIconClassName, sizeClassName } from './utils'
import './styles/itemIcon.scss'
import { ContextType } from 'constants/context'

export type Props = {
  item: Item
  onClick?: (event: React.MouseEvent) => void
  size?: IconSize
  showContext?: boolean
  source?: ItemSource
}

const ItemIcon = (props: Props) => {
  const { item, size, source } = props
  if (!item) {
    console.log('empty item.. wtf')
    return null
  }
  const itemDefinition = getDefinition(item.type)

  if (!itemDefinition) {
    throw new Error(`could not find definition for ${item.type}`)
  }

  const handleClick = (event: React.MouseEvent) => {
    if (props.showContext !== false) {
      const origin = (event.currentTarget as HTMLElement)
      const originRect = origin.getBoundingClientRect()
      TooltipManager.showContextTooltip(ContextType.item, item, originRect, undefined, source)
      event.stopPropagation()
    }

    if (props.onClick != null) {
      props.onClick(event)
    }
  }

  const className = `item-icon ${getIconClassName(itemDefinition.rarity)} ${sizeClassName(size)}`

  return (
    <div className={className}>
      <Icon
        image={itemDefinition.iconImg}
        size={props.size}
        onClick={handleClick}
      />
      {item.quantity !== undefined && item.quantity > 1 && (
        <div className="quantity">{item.quantity}</div>
      )}
    </div>
  )
}

export default ItemIcon
