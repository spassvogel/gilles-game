// todo: hooks!
// https://github.com/react-dnd/react-dnd/pull/1244
import { DragType } from "constants/dragging";
import { getDefinition } from "definitions/items";
import { EquipmentDefinition, EquipmentType } from "definitions/items/equipment";
import { ItemType, Item } from "definitions/items/types";
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

        return itemAndEquipmentSlotMatch(item, props.type);
    },
};

// Returns true if item can be slotted in equipmentSlotType
export const itemAndEquipmentSlotMatch = (item: Item, equipmentSlotType: EquipmentSlotType) => {
    switch (equipmentSlotType) {
        case EquipmentSlotType.chest:
            return checkEquipment(item, EquipmentType.chest);
         case EquipmentSlotType.feet:
            return checkEquipment(item, EquipmentType.feet);
        case EquipmentSlotType.hands:
            return checkEquipment(item, EquipmentType.hands);
        case EquipmentSlotType.head:
            return checkEquipment(item, EquipmentType.head);
        case EquipmentSlotType.legs:
            return checkEquipment(item, EquipmentType.legs);
        case EquipmentSlotType.mainHand:
        case EquipmentSlotType.offHand:
            const itemDefinition = getDefinition(item);
            if (itemDefinition.itemType !== ItemType.weapon) {
                return false;
            }

            // todo: prevent shields to be equipped in main hand
            return true;
        default:
            return false;
    }
}

export enum EquipmentSlotType {
    feet,
    hands,
    chest,
    legs,
    head,
    shoulders,
    mainHand,
    offHand,
}

export interface Props {
    type: EquipmentSlotType;
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

const checkEquipment = (item: Item, equipmentType: EquipmentType) => {
    const itemDefinition = getDefinition(item);
    if (itemDefinition.itemType !== ItemType.equipment) {
        return false;
    }
    return (itemDefinition as EquipmentDefinition).equipmentType === equipmentType;
};