import * as React from "react";
import { PropsWithChildren } from 'react';
import { DragSourceType, DragType } from "constants/dragging";
import { Item } from "definitions/items/types";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { InventoryItemDragInfo } from '../items/DraggableItemIcon';
import { IconSize } from '../common/Icon';
import { itemAndEquipmentSlotMatch } from '../adventurer/EquipmentSlot';

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor) {
        const dragInfo: InventoryItemDragInfo = monitor.getItem();
        if (dragInfo.sourceType === DragSourceType.adventurerEquipment && dragInfo.inventorySlot !== undefined) {
            return props.item == null || itemAndEquipmentSlotMatch(props.item, dragInfo.inventorySlot);
        }
        return props.canDropHere ? props.canDropHere(dragInfo) : true;
    },
};

export interface Props {
    item: Item | null;
    size?: IconSize;
    disabled?: boolean;
    onDrop: (info: InventoryItemDragInfo) => void;
    canDropHere?: ( dragInfo: InventoryItemDragInfo ) => boolean;
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
        disabled,
        connectDropTarget,
    } = props;
    const isActive = isOver && canDrop;

    const classNames = [
        "inventory-item",
        ...(disabled ? ["disabled"]: []),
        ...(isActive ? ["drop-active"] : []),
        ...(!isActive && canDrop ? ["drop-possible"] : [])
    ];


    return connectDropTarget(
        <div className={classNames.join(" ")}>
            { props.children }
        </div>,
    );
}

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(InventorySlot);
