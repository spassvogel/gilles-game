import { useDrop } from 'react-dnd'
import { DragType } from 'constants/dragging'
import { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import { EquipmentSlotType, itemAndEquipmentSlotMatch } from './utils'
import { type PropsWithChildren } from 'react'
import { useAdventurer } from 'hooks/store/adventurers'

import './styles/equipmentslot.scss'

export type Props = {
  type: EquipmentSlotType
  adventurerId: string
  onDrop: (item: InventoryItemDragInfo) => void
}

export type CollectedProps = {
  canDrop: boolean
  isOver: boolean
}

/**
 * The EquipmentSlot displays a slot in which an item can be placed.
 */
const EquipmentSlot = (props: PropsWithChildren<Props>) => {
  const { adventurerId, onDrop } = props
  const adventurer = useAdventurer(adventurerId)

  const [{ isOver, canDrop }, dropRef] = useDrop<InventoryItemDragInfo, unknown, CollectedProps>(() => ({
    accept: DragType.ITEM,
    drop: (info: InventoryItemDragInfo) => {
      onDrop(info)
    },
    collect: (monitor) => {
      const item = monitor.getItem<InventoryItemDragInfo>()?.item
      const validDrop = item !== undefined && itemAndEquipmentSlotMatch(item.type, props.type) && monitor.canDrop()
      console.log('valid', validDrop)
      return {
        canDrop: validDrop,
        isOver: monitor.isOver()
      }
    }
  }), [adventurerId, adventurer.equipment])
  const isActive = isOver && canDrop
  const className = ['equipment-slot']
  if (isActive) {
    className.push('drop-active')
  } else if (canDrop) {
    className.push('drop-possible')
  }

  return (
    <div className={className.join(' ')} title={EquipmentSlotType[props.type]} ref={dropRef}>
      { props.children }
    </div>
  )
}

export default EquipmentSlot
