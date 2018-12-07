import * as React from "react";
import { DragSource, DragSourceCollector, ConnectDragSource, ConnectDropTarget, DragSourceMonitor, DragSourceConnector, DragSourceSpec } from "react-dnd";
import { Equipment, EquipmentDefinition } from "src/definitions/equipment/types";
import equipmentDefinitions from "src/definitions/equipment";

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
export const Types = {
    EQUIPMENT: "equipment",
};

export interface Props {
    index: number;
    equipment: Equipment;
}

interface CollectedProps {
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
}

export interface InventoryItemDragInfo {
    equipment: Equipment;
    inventorySlot?: number
}

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const source: DragSourceSpec<Props, InventoryItemDragInfo> = {
  beginDrag(props: Props) {
    // Return the data describing the dragged item
    return {
        equipment: props.equipment,
        inventorySlot: props.index
    };
  },
  
  endDrag(props: Props, monitor: DragSourceMonitor, component: any) {
    // console.log(monitor.didDrop())    
  }

//   endDrag(monitor: DragSourceMonitor) {
//     debugger;
//     if (!monitor.didDrop()) {
//       return;
//     }

//     // When dropped on a compatible target, do something
//     const item = monitor.getItem();
//     const dropResult = monitor.getDropResult();
//     //CardActions.moveCardToList(item.id, dropResult.listId);
//   },
};

/**
 * Specifies which props to inject into your component.
 */
// tslint:disable-next-line:max-line-length
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
        // Your component receives its own props as usual
        const { index, equipment } = this.props;

        // These two props are injected by React DnD,
        // as defined by your `collect` function above:
        const { isDragging, connectDragSource } = this.props;
        const equipmentDefinition: EquipmentDefinition = equipmentDefinitions[equipment];

        if(isDragging) {
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

// Export the wrapped version
export default DragSource<Props, CollectedProps>(Types.EQUIPMENT, source, collect)(EquipmentIcon);
