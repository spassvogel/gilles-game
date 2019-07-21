import { DragSourceType, DragType } from "constants/dragging";
import { Item } from "definitions/items/types";
import * as React from "react";
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from "react-dnd";
import ItemIcon from "./ItemIcon";

export interface Props {
    index: number;
    item: Item;
    sourceType: DragSourceType;
    sourceId?: string;
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

class DraggableItemIcon extends React.Component<Props & CollectedProps > {

    public render() {
        const { item, onClick, isDragging, connectDragSource } = this.props;

        const handleClick = (event: React.MouseEvent) => {
            if (onClick) {
                onClick(event);
            }
        };
        if (isDragging) {
            // TODO: can show some sort of empty state?
            return null;
        }
        return connectDragSource(
            <div>
                <ItemIcon
                    item = { item }
                    onClick = { handleClick }
            />
            </div>,
        );
    }
}

export default DragSource<Props, CollectedProps>(DragType.ITEM, source, collect)(DraggableItemIcon);
