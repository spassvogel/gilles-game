// https://github.com/react-dnd/react-dnd/pull/1244
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { DragType } from "constants/dragging";
import { getDefinition } from "definitions/items";
import { ApparelDefinition } from "definitions/items/apparel";
import { Item, ItemType } from "definitions/items/types";
import { WeaponDefinition, WeaponTypeDefinition, WeaponClassification } from 'definitions/items/weapons';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';
import "./styles/equipmentslot.scss";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor)  {
        const item = monitor.getItem().item;

        return itemAndEquipmentSlotMatch(item, props.type);
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

// Returns true if item can be slotted in equipmentSlotType
export const itemAndEquipmentSlotMatch = (item: Item, equipmentSlotType: EquipmentSlotType) => {
    switch (equipmentSlotType) {
        case EquipmentSlotType.chest:
        case EquipmentSlotType.feet:
        case EquipmentSlotType.hands:
        case EquipmentSlotType.head:
        case EquipmentSlotType.legs:
            return checkEquipment(item, equipmentSlotType);
        case EquipmentSlotType.mainHand:
        case EquipmentSlotType.offHand:
            const itemDefinition: WeaponDefinition = getDefinition(item) as WeaponDefinition;
            if (itemDefinition.itemType !== ItemType.weapon) {
                return false;
            }
            const { classification } = WeaponTypeDefinition[itemDefinition.weaponType];
            switch (classification) {
                case WeaponClassification.oneHanded:
                    return true;
                case WeaponClassification.mainHand:
                    return equipmentSlotType === EquipmentSlotType.mainHand;
                case WeaponClassification.offHand:
                case WeaponClassification.shield:
                    return equipmentSlotType === EquipmentSlotType.offHand;
            }

            // todo: prevent shields to be equipped in main hand
            return true;
        default:
            return false;
    }
};

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
        <div className = "equipment-slot" style = { { borderColor }} title={EquipmentSlotType[props.type]}>
            { props.children }
        </div>,
    );
};

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(EquipmentSlot);

const checkEquipment = (item: Item, equipmentType: EquipmentSlotType) => {
    const itemDefinition = getDefinition(item);
    if (itemDefinition.itemType !== ItemType.apparel) {
        return false;
    }
    return (itemDefinition as ApparelDefinition).equipmentType === equipmentType;
};
