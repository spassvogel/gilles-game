import { DragSourceType, DragType } from "constants/dragging";
import { getClassName, IconSize } from "constants/icons";
import { Item } from "definitions/items/types";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { InventoryItemDragInfo } from "../DraggableItemIcon";
import { itemAndEquipmentSlotMatch } from "../EquipmentSlot";
import { PropsWithChildren } from 'react';

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor) {
        const dragInfo: InventoryItemDragInfo = monitor.getItem();
        if (dragInfo.sourceType === DragSourceType.adventurerEquipment) {
            return props.item == null || itemAndEquipmentSlotMatch(props.item, dragInfo.inventorySlot!);
        }
        return true;
    },
};

export interface Props {
    item: Item | null;
    onDrop: (item: any) => void;
    size?: IconSize;
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
 * The InventorySlot displays a slot in which an item can be placed.
 */
const InventorySlot = (props: PropsWithChildren<Props> & DropSourceProps) => {
    const {
        isOver,
        canDrop,
        connectDropTarget,
    } = props;
    const isActive = isOver && canDrop;

    const classNames = [
        "inventory-item",
        getClassName(props.size),
    ];

    if (isActive) {
        classNames.push("drop-active");
    } else if (canDrop) {
        classNames.push("drop-possible");
    }

    return connectDropTarget(
        <div className = { classNames.join(" ") }>
            { props.children }
        </div>,
    );
}

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(InventorySlot);
