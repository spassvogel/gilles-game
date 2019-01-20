import * as React from "react";
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from "react-dnd";
import { DragType, DragSourceType } from "src/constants";
import { Item } from "src/definitions/items/types";
import ItemIcon from "./ItemIcon";

export interface Props {
    index: number;
    item: Item;
    source: DragSourceType;
    onClick?: () => void;
}

interface CollectedProps {
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
}

export interface InventoryItemDragInfo {
    item: Item;
    inventorySlot?: number;
    source: DragSourceType;
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
            source: props.source,
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

        if (isDragging) {
            // TODO: can show some sort of empty state?
            return null;
        }
        return connectDragSource(
            <div>
                <ItemIcon
                item={ item }
                onClick= { onClick }
            />
            </div>,
        );
    }
}

export default DragSource<Props, CollectedProps>(DragType.ITEM, source, collect)(DraggableItemIcon);
