import * as React from 'react';
import { ConnectDropTarget, useDrop } from 'react-dnd';
import { DragType } from 'constants/dragging';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { isConsumable } from 'definitions/items/consumables';
import './styles/consumeitemslot.scss';

export interface Props {
  onDrop: (item: InventoryItemDragInfo) => void;
}

export interface DropSourceProps {
  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}


/**
 * The ConsumeItemSlot displays a slot in which a consumable item can be placed
 */
const ConsumeItemSlot = (props: React.PropsWithChildren<Props>) => {

  const { onDrop } = props;
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: DragType.ITEM,
    canDrop: ({ item }: InventoryItemDragInfo) => {
      // Can only drop consumables here
      return isConsumable(item.type);
    },
    drop: (info: InventoryItemDragInfo) => {
      onDrop(info);
    },
    // Props to collect
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    //  // The border is still green for some reason ??
    //  collect: (monitor: DropTargetMonitor<InventoryItemDragInfo>) => {
    //   const dragInfo = monitor.getItem();
    //   // Can only drop consumables here
    //   const canDrop = dragInfo !== null && isConsumable(dragInfo.item) && monitor.canDrop()
    //   // console.log(canDrop)
    //   return {
    //   isOver: monitor.isOver(),
    //   canDrop
    //   }
    // }
  }));
  const className = ['consume-item-slot'];
  if (isOver) {
    className.push('drop-active');
  } else if (canDrop) {
    className.push('drop-possible');
  }
  return (
    <div className={className.join(' ')} ref={drop}>
      {props.children}
    </div>
  );
};

export default ConsumeItemSlot;
