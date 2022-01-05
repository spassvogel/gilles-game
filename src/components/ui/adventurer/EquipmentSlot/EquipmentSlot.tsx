// todo: refactor hooks https://github.com/react-dnd/react-dnd/pull/1244
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from 'react-dnd';
import { DragType } from 'constants/dragging';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { EquipmentSlotType, itemAndEquipmentSlotMatch } from './utils';
import './styles/equipmentslot.scss';

const dropTarget: DropTargetSpec<Props> = {
  drop(props: Props, monitor: DropTargetMonitor<InventoryItemDragInfo>) {
    props.onDrop(monitor.getItem());
  },
  canDrop(props: Props, monitor: DropTargetMonitor)  {
    const item = monitor.getItem<InventoryItemDragInfo>().item;

    return itemAndEquipmentSlotMatch(item.type, props.type);
  },
};

export interface Props {
  type: EquipmentSlotType;
  onDrop: (item: InventoryItemDragInfo) => void;
}

export interface DropSourceProps {
  canDrop: boolean;
  isOver: boolean;
  connectDropTarget: ConnectDropTarget;
}

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  canDrop: monitor.canDrop(),
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
});

/**
 * The EquipmentSlot displays a slot in which an item can be placed.
 */
const EquipmentSlot = (props: React.PropsWithChildren<Props & DropSourceProps>) => {
  const {
    isOver,
    canDrop,
    connectDropTarget,
  } = props;
  const isActive = isOver && canDrop;
  const className = ['equipment-slot'];
  if (isActive) {
    className.push('drop-active');
  } else if (canDrop) {
    className.push('drop-possible');
  }

  return connectDropTarget(
    <div className={className.join(' ')} title={EquipmentSlotType[props.type]}>
      { props.children }
    </div>,
  );
};

export default DropTarget<Props, DropSourceProps>(
  DragType.ITEM,
  dropTarget,
  collect,
)(EquipmentSlot);

