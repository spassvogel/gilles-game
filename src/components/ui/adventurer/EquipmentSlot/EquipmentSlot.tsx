import { ConnectDropTarget, DropTargetMonitor, useDrop } from 'react-dnd';
import { DragType } from 'constants/dragging';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { EquipmentSlotType, itemAndEquipmentSlotMatch } from './utils';
import { PropsWithChildren } from 'react';
import './styles/equipmentslot.scss';

// const dropTarget: DropTargetSpec<Props> = {
//   drop(props: Props, monitor: DropTargetMonitor<InventoryItemDragInfo>) {
//     props.onDrop(monitor.getItem());
//   },
//   canDrop(props: Props, monitor: DropTargetMonitor)  {
//     const item = monitor.getItem<InventoryItemDragInfo>().item;

//     return itemAndEquipmentSlotMatch(item.type, props.type);
//   },
// };

export interface Props {
  type: EquipmentSlotType;
  onDrop: (item: InventoryItemDragInfo) => void;
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
 * The EquipmentSlot displays a slot in which an item can be placed.
 */
const EquipmentSlot = (props: PropsWithChildren<Props>) => {
  const {
    // isOver,
    // canDrop,
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
  const className = ['equipment-slot'];
  if (isActive) {
    className.push('drop-active');
  } else if (canDrop) {
    className.push('drop-possible');
  }

  return (
    <div className={className.join(' ')} title={EquipmentSlotType[props.type]} ref={dropRef}>
      { props.children }
    </div>
  );
};

export default EquipmentSlot;

