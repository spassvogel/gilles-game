import { DragType } from "constants/dragging";
import { getClassName, IconSize } from "constants/icons";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor)  {
        return true;
    },
};

export interface Props {
    empty: boolean;
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
class InventorySlot extends React.Component<Props & DropSourceProps> {
    public render() {
        const {
            isOver,
            canDrop,
            connectDropTarget,
        } = this.props;
        const isActive = isOver && canDrop;

        const classNames = [
            "inventory-item",
            getClassName(this.props.size),
        ];

        let borderColor = "grey";
        if (isActive) {
            classNames.push("drop-active");
            borderColor = "green";
        } else if (canDrop) {
            classNames.push("drop-possible");
            borderColor = "orange";
        }

        return connectDropTarget(
            <div className = { classNames.join(" ") }>
                { this.props.children }
            </div>,
        );
    }
}

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(InventorySlot);
