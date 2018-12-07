import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { Types } from "./EquipmentIcon";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props)  {
        return props.empty;
    },
};

export interface Props {
    lastDroppedItem?: any;
    empty: boolean;
    onDrop: (item: any) => void;
}

export interface DropSourceProps {
    canDrop: boolean;
    isOver: boolean;
    connectDropTarget: ConnectDropTarget;
}

class InventorySlot extends React.Component<Props & DropSourceProps> {
    public render() {
        const {
            isOver,
            canDrop,
            connectDropTarget,
            lastDroppedItem,
        } = this.props;
        const isActive = isOver && canDrop;

        let backgroundColor = "#222";
        if (isActive) {
            backgroundColor = "darkgreen";
        } else if (canDrop) {
            backgroundColor = "darkkhaki";
        }

        return connectDropTarget(
            <div style={{ backgroundColor }} className="inventory-item">
                { this.props.children }
            </div>,
        );
    }
}

export default DropTarget<Props, DropSourceProps>(
    Types.EQUIPMENT,
    dropTarget,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }),
)(InventorySlot);
