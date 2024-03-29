import { type DragSourceType } from 'constants/dragging'
import { type Item } from 'definitions/items/types'
import InventorySlot from './InventorySlot'
import DraggableItemIcon, { type InventoryItemDragInfo } from '../items/DraggableItemIcon'
import { type IconSize } from '../common/Icon'

import './styles/inventory.scss'

export type Props = {
  items: Array<Item | null>
  sourceId?: string // who does this inventory belong to?
  sourceType: DragSourceType
  iconSize?: IconSize
  className?: string
  disabledIndex?: number

  onDropItem: (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => void
  onStartDrag?: (item: Item, fromSlot: number) => void
  canDropHere?: (dragInfo: InventoryItemDragInfo) => boolean
}

/**
 * Inventory is used to show Items. They can be dragged about
 * @param props
 */
const Inventory = (props: Props) => {
  const { items, disabledIndex, sourceId, sourceType, iconSize, canDropHere, onStartDrag } = props
  const slots = []
  for (let i = 0; i < items.length; i++) {
    let contents
    const item = items[i]
    const handleDrop = (dragInfo: InventoryItemDragInfo) => {
      if (dragInfo.inventorySlot === i && dragInfo.sourceType === props.sourceType && dragInfo.sourceId === props.sourceId) {
        return
      }
      if (props.onDropItem && dragInfo.inventorySlot !== undefined) {
        const { inventorySlot: fromSlot } = dragInfo
        props.onDropItem(dragInfo.item, fromSlot, i, dragInfo.sourceType, dragInfo.sourceId)
      }
    }

    const handleCheckDrop = (dragInfo: InventoryItemDragInfo) => {
      return (canDropHere != null) ? canDropHere(dragInfo) : true
    }

    const handleStartDrag = () => {
      if (item != null) {
        onStartDrag?.(item, i)
      }
    }

    if (item != null) {
      contents = (
        <DraggableItemIcon
          index={i}
          sourceId={sourceId}
          sourceType={sourceType}
          item={item}
          onStartDrag={handleStartDrag}
        />
      )
    }

    const slot = (
      <InventorySlot
        key={`inventory-slot-${i}`}
        item={item}
        size={iconSize}
        disabled={disabledIndex === i}
        sourceId={sourceId}
        onDrop={handleDrop}
        canDropHere={handleCheckDrop}
        dependencies={[items]}
      >
        {contents}
      </InventorySlot>
    )
    slots.push(slot)
  }
  return (
    <div className={`inventory ${props.className ?? ''}`}>
      {slots}
    </div>
  )
}
export default Inventory
