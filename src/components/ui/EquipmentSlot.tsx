// todo: hooks!
// https://github.com/react-dnd/react-dnd/pull/1244
import { DragType } from "constants/dragging";
import { getDefinition } from "definitions/items";
import { EquipmentDefinition, EquipmentType } from "definitions/items/equipment";
import { ItemDefinition, ItemType } from "definitions/items/types";
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

        switch (props.type) {
            case EquipmentSlotType.chest:
                return checkEquipment(def, EquipmentType.chest);
             case EquipmentSlotType.feet:
                return checkEquipment(def, EquipmentType.feet);
            case EquipmentSlotType.hands:
                return checkEquipment(def, EquipmentType.hands);
            case EquipmentSlotType.head:
                return checkEquipment(def, EquipmentType.head);
            case EquipmentSlotType.legs:
                return checkEquipment(def, EquipmentType.legs);
            case EquipmentSlotType.mainHand:
            case EquipmentSlotType.offHand:
                if (def.itemType !== ItemType.weapon) {
                    return false;
                }

                // todo: prevent shields to be equipped in main hand
                return true;
            default:
                return false;
        }
    },
};

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

const checkEquipment = (def: ItemDefinition, equipmentType: EquipmentType) => {
    if (def.itemType !== ItemType.equipment) {
        return false;
    }
    return  (def as EquipmentDefinition).equipmentType === equipmentType;
}