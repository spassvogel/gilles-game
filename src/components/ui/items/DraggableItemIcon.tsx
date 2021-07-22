import * as React from "react";
import { IconSize } from 'components/ui/common/Icon';
import { DragSourceType, DragType } from "constants/dragging";
import { Item } from "definitions/items/types";
import ItemIcon from "./ItemIcon";
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from "react-dnd";
import { useMemo } from "react";
import { ItemSource } from "constants/items";

export interface Props {
    index: number;
    item: Item;
    sourceType: DragSourceType;
    sourceId?: string;
    size?: IconSize;

    onClick?: (event: React.MouseEvent) => void;
}

interface CollectedProps {
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
}

export interface InventoryItemDragInfo {
    item: Item;
    inventorySlot?: number;
    sourceId?: string;
    sourceType: DragSourceType;
}

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const source: DragSourceSpec<Props, InventoryItemDragInfo> = {
    beginDrag(props: Props) {
        // Return the data describing the dragged item
        return {
            inventorySlot: props.index,
            item: props.item,
            sourceId: props.sourceId,
            sourceType: props.sourceType,
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
    if (isDragging) {
        // TODO: can show some sort of empty state?
        return null;
    }
    const source = useMemo<ItemSource>(() => ({
        origin: sourceType,
        id: sourceId,
        slot: index
    }), []);

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
}

export default DragSource<Props, CollectedProps>(DragType.ITEM, source, collect)(DraggableItemIcon);
