import { PropsWithChildren } from 'react';
import { DragSourceType, DragType } from 'constants/dragging';
import { Item } from 'definitions/items/types';
import { useDrop } from 'react-dnd';
import { InventoryItemDragInfo } from '../items/DraggableItemIcon';
import { IconSize } from '../common/Icon';
import { itemAndEquipmentSlotMatch } from '../adventurer/EquipmentSlot';

export interface Props {
  item: Item | null;
  size?: IconSize;
  disabled?: boolean;
  onDrop: (info: InventoryItemDragInfo) => void;
  canDropHere?: ( dragInfo: InventoryItemDragInfo ) => boolean;
}

export interface CollectedProps {
  canDrop: boolean;
  isOver: boolean;
}

/**
 * The InventorySlot displays a slot in which an item can be placed.
 */
const InventorySlot = (props: PropsWithChildren<Props>) => {
  const {
    item,
    disabled,
    canDropHere,
    onDrop,
  } = props;

  const [{ isOver, canDrop }, dropRef] = useDrop<InventoryItemDragInfo, void, CollectedProps>(() => ({
    accept: DragType.ITEM,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    canDrop: (dragInfo: InventoryItemDragInfo) => {
      if (dragInfo.sourceType === DragSourceType.adventurerEquipment && dragInfo.inventorySlot !== undefined) {
        return item == null || itemAndEquipmentSlotMatch(item.type, dragInfo.inventorySlot);
      }
      return canDropHere?.(dragInfo) ?? true;
    },
    drop: (dragInfo: InventoryItemDragInfo) => {
      return onDrop(dragInfo);
    },
  }));
  const isActive = isOver && canDrop;

  const className = [
    'inventory-item',
    ...(disabled ? ['disabled'] : []),
    ...(isActive ? ['drop-active'] : []),
    ...(!isActive && canDrop ? ['drop-possible'] : []),
  ].join(' ');


  return (
    <div className={className} ref={dropRef}>
      { props.children }
    </div>
  );
};

export default InventorySlot;

