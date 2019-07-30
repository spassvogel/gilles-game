// todo: hooks!
// https://github.com/react-dnd/react-dnd/pull/1244
import { DragType } from "constants/dragging";
import { getDefinition } from "definitions/items";
import { EquipmentDefinition, EquipmentType } from "definitions/items/equipment";
import { Item, ItemType } from "definitions/items/types";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import "./css/equipmentslot.css";
import { InventoryItemDragInfo } from "./DraggableItemIcon";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor)  {
        const item = monitor.getItem().item;
        const def = getDefinition(item);
        // Can only drop the right equipment type
        if (def.itemType !== ItemType.equipment) {
            return false;
        }
        const equipmentDef = def as EquipmentDefinition;
        return equipmentDef.equipmentType === props.type;
    },
};

export interface Props {
    type: EquipmentType;
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
    let borderColor = "grey";
    if (isActive) {
        borderColor = "green";
    } else if (canDrop) {
        borderColor = "orange";
    }

    return connectDropTarget(
        <div  className = "equipment-slot" style = { { borderColor }}>
            { props.children }
        </div>,
    );
};

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(EquipmentSlot);
