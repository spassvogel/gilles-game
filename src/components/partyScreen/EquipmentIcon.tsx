import * as React from "react";
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from "react-dnd";
import { DragType } from "src/constants";
import equipmentDefinitions from "src/definitions/equipment";
import { Equipment as Item, EquipmentDefinition } from "src/definitions/equipment/types";

export interface Props {
    index: number;
    item: Item;
    source: string;
}

interface CollectedProps {
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
}

export interface InventoryItemDragInfo {
    item: Item;
    inventorySlot?: number;
    source: string;
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
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
  };
}

class EquipmentIcon extends React.Component<Props & CollectedProps > {
    public render() {
        const { index, item: equipment } = this.props;

        // These two props are injected by React DnD,
        // as defined by your `collect` function above:
        const { isDragging, connectDragSource } = this.props;
        const equipmentDefinition: EquipmentDefinition = equipmentDefinitions[equipment];

        if (isDragging) {
            // todo: can show some sort of empty state?
            return null;
        }
        return connectDragSource(
            <div className="equipment-icon"
                style = {{
                backgroundImage: `url(${equipmentDefinition.iconImg})`,
            }}>
                {index}
                {isDragging && "!"}
            </div>,
        );
    }
}

export default DragSource<Props, CollectedProps>(DragType.ITEM, source, collect)(EquipmentIcon);
