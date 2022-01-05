import { useMemo } from 'react';
import { IconSize } from 'components/ui/common/Icon';
import { DragSourceType, DragType } from 'constants/dragging';
import { Item } from 'definitions/items/types';
import ItemIcon from './ItemIcon';
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from 'react-dnd';
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
  connectDragSource: ConnectDragSource;
}

export interface InventoryItemDragInfo { // todo: rename to ItemDragInfo
  item: Item;
  inventorySlot?: number;
  sourceId?: string;
  sourceType: DragSourceType;
}

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const spec: DragSourceSpec<Props, InventoryItemDragInfo> = {
  beginDrag(props: Props) {
    const {
      onStartDrag,
      index,
      item,
      sourceId,
      sourceType,
    } = props;
    onStartDrag?.();

    // Return the data describing the dragged item
    return {
      inventorySlot: index,
      item,
      sourceId,
      sourceType,
    };
  },
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

const DraggableItemIcon = (props: Props & CollectedProps) => {

  const { item, onClick, isDragging, connectDragSource, size, index, sourceType, sourceId } = props;
  const handleClick = (event: React.MouseEvent) => {
    onClick?.(event);
  };

  const source = useMemo<ItemSource>(() => ({
    origin: sourceType,
    id: sourceId,
    slot: index,
  }), [index, sourceId, sourceType]);

  if (isDragging) {
    // TODO: can show some sort of empty state?
    return null;
  }

  // The wrapping div is needed by ReactDnD
  return connectDragSource((
    <div>
      <ItemIcon
        item={item}
        source={source}
        onClick={handleClick}
        size={size}
      />
    </div>
  ));
};

export default DragSource<Props, CollectedProps>(DragType.ITEM, spec, collect)(DraggableItemIcon);
