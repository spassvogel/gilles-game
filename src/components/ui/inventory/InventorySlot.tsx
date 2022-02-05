import { PropsWithChildren } from 'react';
import { DragSourceType, DragType } from 'constants/dragging';
import { Item } from 'definitions/items/types';
import { DropTargetConnector, DropTargetMonitor, DropTargetSpec, useDrop } from 'react-dnd';
import { InventoryItemDragInfo } from '../items/DraggableItemIcon';
import { IconSize } from '../common/Icon';
import { itemAndEquipmentSlotMatch } from '../adventurer/EquipmentSlot';

// const dropTarget: DropTargetSpec<Props> = {
//   drop(props: Props, monitor: DropTargetMonitor<InventoryItemDragInfo>) {
//     props.onDrop(monitor.getItem());
//   },
//   canDrop(props: Props, monitor: DropTargetMonitor) {
//     const dragInfo: InventoryItemDragInfo = monitor.getItem();
//     if (dragInfo.sourceType === DragSourceType.adventurerEquipment && dragInfo.inventorySlot !== undefined) {
//       return props.item == null || itemAndEquipmentSlotMatch(props.item.type, dragInfo.inventorySlot);
//     }
//     return props.canDropHere ? props.canDropHere(dragInfo) : true;
//   },
// };

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
  // connectDropTarget: ConnectDropTarget;
}

// const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
//   canDrop: monitor.canDrop(),
//   connectDropTarget: connect.dropTarget(),
//   isOver: monitor.isOver(),
// });

/**
 * The InventorySlot displays a slot in which an item can be placed.
 */
const InventorySlot = (props: PropsWithChildren<Props>) => {
  const {
    // isOver,
    // canDrop,
    disabled,
    // connectDropTarget,
  } = props;


  const [collectedProps, dropRef] = useDrop<InventoryItemDragInfo, null, CollectedProps>(() => ({
    accept: DragType.ITEM,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));
console.log(collectedProps);
  const { isOver, canDrop } = collectedProps;

  const isActive = isOver && canDrop;

  const classNames = [
    'inventory-item',
    ...(disabled ? ['disabled'] : []),
    ...(isActive ? ['drop-active'] : []),
    ...(!isActive && canDrop ? ['drop-possible'] : []),
  ].join(' ');


  return (
    <div className={classNames} ref={dropRef}>
      { props.children }
    </div>
  );
};

export default InventorySlot;
// export default DropTarget<Props, DropSourceProps>(
//   DragType.ITEM,
//   dropTarget,
//   collect,
// )(InventorySlot);

// export default () => {
//   return null;
// };
