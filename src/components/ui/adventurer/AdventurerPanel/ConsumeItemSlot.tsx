import { useDrop } from 'react-dnd'
import { DragType } from 'constants/dragging'
import { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import { isConsumable } from 'definitions/items/consumables'
import { type PropsWithChildren } from 'react'

import './styles/consumeItemSlot.scss'

export type Props = {
  onDrop: (item: InventoryItemDragInfo) => void
}

export type CollectedProps = {
  canDrop: boolean
  isOver: boolean
}

/**
 * The ConsumeItemSlot displays a slot in which a consumable item can be placed
 */
const ConsumeItemSlot = (props: PropsWithChildren<Props>) => {
  const { onDrop } = props
  const [{ canDrop, isOver }, dropRef] = useDrop<InventoryItemDragInfo, unknown, CollectedProps>(() => ({
    // The type (or types) to accept - strings or symbols
    accept: DragType.ITEM,
    canDrop: ({ item }: InventoryItemDragInfo) => {
      // Can only drop consumables here
      return isConsumable(item.type)
    },
    drop: (info: InventoryItemDragInfo) => {
      onDrop(info)
    },
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
    //  // The border is still green for some reason ??
    //  collect: (monitor: DropTargetMonitor<InventoryItemDragInfo>) => {
    //   const dragInfo = monitor.getItem()
    //   // Can only drop consumables here
    //   const canDrop = dragInfo !== null && isConsumable(dragInfo.item) && monitor.canDrop()
    //   // console.log(canDrop)
    //   return {
    //   isOver: monitor.isOver(),
    //   canDrop
    //   }
    // }
  }))
  const className = ['consume-item-slot']
  if (isOver) {
    className.push('drop-active')
  } else if (canDrop) {
    className.push('drop-possible')
  }
  return (
    <div className={className.join(' ')} ref={dropRef}>
      {props.children}
    </div>
  )
}

export default ConsumeItemSlot
