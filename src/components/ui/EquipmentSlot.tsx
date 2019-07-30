// todo: hooks!
// https://github.com/react-dnd/react-dnd/pull/1244
import { DragType } from "constants/dragging";
import { EquipmentType } from "definitions/items/equipment";
import { Item } from "definitions/items/types";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props)  {
        return props.item === null; // todo: check if correct type
    },
};

export interface Props {
    item: Item | null;
    type: EquipmentType;
    onDrop: (item: Item) => void;
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

    let borderColor = "#1b8417";
    if (isActive) {
        borderColor = "#e2bc23";
    } else if (canDrop) {
        borderColor = "#7ea752";
    }

    return connectDropTarget(
        <div  className = "inventory-item">
            { props.children }
        </div>,
    );
};

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(EquipmentSlot);
