import { useMemo } from 'react';
import { IconSize } from 'components/ui/common/Icon';
import { DragSourceType, DragType } from 'constants/dragging';
import { Item } from 'definitions/items/types';
import ItemIcon from './ItemIcon';
import { useDrag } from 'react-dnd';
import { ItemSource } from 'constants/items';

export interface Props {
  index: number;
  item: Item;
  sourceType: DragSourceType;
  sourceId?: string;
  size?: IconSize;

  onStartDrag?: () => void;
  onClick?: (event: React.MouseEvent) => void;
}

interface CollectedProps {
  isDragging: boolean;
}

export interface InventoryItemDragInfo { // todo: rename to ItemDragInfo
  item: Item;
  inventorySlot?: number;
  sourceId?: string;
  sourceType: DragSourceType;
}


const DraggableItemIcon = (props: Props) => {

  const { item, onClick, size, index, sourceType, sourceId } = props;

  const [collected, dragRef] = useDrag<InventoryItemDragInfo, null, CollectedProps>(() => ({
    type: DragType.ITEM,
    item: {
      inventorySlot: index,
      item,
      sourceId,
      sourceType,
    },
  }), [item]);

  const handleClick = (event: React.MouseEvent) => {
    onClick?.(event);
  };

  const source = useMemo<ItemSource>(() => ({
    origin: sourceType,
    id: sourceId,
    slot: index,
  }), [index, sourceId, sourceType]);

  if (collected.isDragging) {
    // TODO: can show some sort of empty state?
    return null;
  }

  // The wrapping div is needed by ReactDnD
  return (
    <div ref={dragRef}>
      <ItemIcon
        item={item}
        source={source}
        onClick={handleClick}
        size={size}
      />
    </div>
  );
};

export default DraggableItemIcon;
