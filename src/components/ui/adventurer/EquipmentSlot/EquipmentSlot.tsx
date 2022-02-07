import { useDrop } from 'react-dnd';
import { DragType } from 'constants/dragging';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { EquipmentSlotType } from './utils';
import { PropsWithChildren } from 'react';
import './styles/equipmentslot.scss';


export interface Props {
  type: EquipmentSlotType;
  onDrop: (item: InventoryItemDragInfo) => void;
}

export interface CollectedProps {
  canDrop: boolean;
  isOver: boolean;
}

/**
 * The EquipmentSlot displays a slot in which an item can be placed.
 */
const EquipmentSlot = (props: PropsWithChildren<Props>) => {

  const { onDrop } = props;
  const [{ isOver, canDrop }, dropRef] = useDrop<InventoryItemDragInfo, void, CollectedProps>(() => ({
    accept: DragType.ITEM,
    drop: (info: InventoryItemDragInfo) => {
      onDrop(info);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }));
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

