import { useDrop } from 'react-dnd';
import { DragType } from 'constants/dragging';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import { EquipmentSlotType } from './utils';
import { PropsWithChildren } from 'react';
import './styles/equipmentslot.scss';
import { useAdventurer } from 'hooks/store/adventurers';


export interface Props {
  type: EquipmentSlotType;
  adventurerId: string;
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

  const { adventurerId, onDrop } = props;
  const adventurer = useAdventurer(adventurerId);

  const [{ isOver, canDrop }, dropRef] = useDrop<InventoryItemDragInfo, void, CollectedProps>(() => ({
    accept: DragType.ITEM,
    drop: (info: InventoryItemDragInfo) => {
      onDrop(info);
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
  }), [adventurerId, adventurer.equipment]);
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

