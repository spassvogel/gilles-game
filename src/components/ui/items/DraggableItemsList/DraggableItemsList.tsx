import { type ReactNode } from 'react'
import { type Item } from 'definitions/items/types'
import { type DragSourceType } from 'constants/dragging'
import DraggableItemIcon from '../DraggableItemIcon'
import ItemText from './ItemText'

import './styles/itemsList.scss'

export type Props = {
  className?: string
  items: Item[]
  sourceType: DragSourceType
  sourceId?: string
  slots?: number // optionally always show this amount of slots
  renderButton?: (item: Item, index: number) => ReactNode
}

/**
 * The ItemsList displays a list of items vertically. Shows icon and description
 */
const DraggableItemsList = (props: Props) => {
  const { renderButton, items } = props
  const className = `items-list ${props.className ?? ''}`
  const slots = props.slots ?? items.length
  return (
    <ul className={className} >
      {[...Array(slots)].map((_, index) => {
        const item = items[index]
        return (
          <li
            key={`${item?.type}${index}`}
            className="item-row"
          >
            <div className="item-placeholder" />
            {item !== undefined && (
              <>
                <DraggableItemIcon
                  item={item}
                  index={index}
                  sourceId={props.sourceId}
                  sourceType={props.sourceType}
                />
                <ItemText item={item} />
                { renderButton?.(item, index) }
              </>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default DraggableItemsList
