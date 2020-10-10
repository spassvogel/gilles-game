import { DragType } from "constants/dragging";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import "./styles/droppableadventurerslot.scss";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor)  {
        return true; // todo: can't drop on yourself
    },
};

export interface Props {
    onDrop: (item: any) => void;
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

/*
 * Can drop adventurers on this */
const DroppableAdventurerSlot = (props: Props & DropSourceProps) => {
    const {
        isOver,
        canDrop,
        connectDropTarget,
    } = props;
    // const isActive = isOver && canDrop;
    let className = "droppable-adventurer-slot";

    if (isOver) {
        className += " active-drop";
    } else if (canDrop) {
        className += " can-drop";
    }

    return connectDropTarget(
        <div className = { className }/>
    );
}

export default DropTarget<Props, DropSourceProps>(
    DragType.ADVENTURER,
    dropTarget,
    collect,
)(DroppableAdventurerSlot);
