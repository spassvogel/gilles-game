import { type PropsWithChildren } from 'react'
import { DragSourceType, DragType } from 'constants/dragging'
import { type Item } from 'definitions/items/types'
import { useDrop } from 'react-dnd'
import { type InventoryItemDragInfo } from '../items/DraggableItemIcon'
import { type IconSize } from '../common/Icon'
import { itemAndEquipmentSlotMatch } from '../adventurer/EquipmentSlot'

export type Props = {
  item: Item | null
  sourceId?: string
  size?: IconSize
  disabled?: boolean
  dependencies?: unknown[]
  onDrop: (info: InventoryItemDragInfo) => void
  canDropHere?: (dragInfo: InventoryItemDragInfo) => boolean
}

export type CollectedProps = {
  canDrop: boolean
  isOver: boolean
}

/**
 * The InventorySlot displays a slot in which an item can be placed.
 */
const InventorySlot = (props: PropsWithChildren<Props>) => {
  const {
    item,
    disabled,
    sourceId,
    dependencies = [],
    canDropHere,
    onDrop
  } = props

  const [{ isOver, canDrop }, dropRef] = useDrop<InventoryItemDragInfo, unknown, CollectedProps>(() => ({
    accept: DragType.ITEM,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    }),
    canDrop: (dragInfo: InventoryItemDragInfo) => {
      if (dragInfo.sourceType === DragSourceType.adventurerEquipment && dragInfo.inventorySlot !== undefined) {
        return item == null || itemAndEquipmentSlotMatch(item.type, dragInfo.inventorySlot)
      }
      return canDropHere?.(dragInfo) ?? true
    },
    drop: (dragInfo: InventoryItemDragInfo) => {
      onDrop(dragInfo)
    }
  }), [sourceId, ...dependencies])
  const isActive = isOver && canDrop

  const className = [
    'inventory-item',
    ...(disabled === true ? ['disabled'] : []),
    ...(isActive ? ['drop-active'] : []),
    ...(!isActive && canDrop ? ['drop-possible'] : [])
  ].join(' ')

  return (
    <div className={className} ref={dropRef}>
      { props.children }
    </div>
  )
}

export default InventorySlot
