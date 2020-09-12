// https://github.com/react-dnd/react-dnd/pull/1244
import { DragType } from "constants/dragging";
import { getDefinition } from "definitions/items";
import { ApparelDefinition, ApparelType } from "definitions/items/apparel";
import { Item, ItemType } from "definitions/items/types";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { InventoryItemDragInfo } from '../DraggableItemIcon';
import "./styles/equipmentslot.scss";
import { WeaponDefinition, typeClassifications, WeaponClassification } from 'definitions/items/weapons';

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
            return checkEquipment(item, ApparelType.chest);
         case EquipmentSlotType.feet:
            return checkEquipment(item, ApparelType.feet);
        case EquipmentSlotType.hands:
            return checkEquipment(item, ApparelType.hands);
        case EquipmentSlotType.head:
            return checkEquipment(item, ApparelType.head);
        case EquipmentSlotType.legs:
            return checkEquipment(item, ApparelType.legs);
        case EquipmentSlotType.mainHand:
        case EquipmentSlotType.offHand:
            const itemDefinition: WeaponDefinition = getDefinition(item) as WeaponDefinition;
            if (itemDefinition.itemType !== ItemType.weapon) {
                return false;
            }
            const weaponClassification: WeaponClassification = typeClassifications[itemDefinition.weaponType];
            switch (weaponClassification) {
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

const checkEquipment = (item: Item, equipmentType: ApparelType) => {
    const itemDefinition = getDefinition(item);
    if (itemDefinition.itemType !== ItemType.apparel) {
        return false;
    }
    return (itemDefinition as ApparelDefinition).equipmentType === equipmentType;
};
