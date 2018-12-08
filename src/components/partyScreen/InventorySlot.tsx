import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { DragType } from "src/constants";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props)  {
        return props.empty;
    },
};

export interface Props {
    empty: boolean;
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

        let borderColor = "#1b8417";
        if (isActive) {
            borderColor = "#e2bc23";
        } else if (canDrop) {
            borderColor = "#7ea752";
        }

        return connectDropTarget(
            <div style={{ borderColor }} className="inventory-item">
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
