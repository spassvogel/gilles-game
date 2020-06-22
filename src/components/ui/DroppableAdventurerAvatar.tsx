import { DragType } from "constants/dragging";
import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import AdventurerAvatar, { Props as AdventurerAvatarProps} from "./AdventurerAvatar";
import "./css/droppableadventureravatar.css";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor)  {
        return true; // todo: can't drop on yourself
    },
};

export interface Props extends AdventurerAvatarProps {
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
 * The AdventurerAvatar displays the avatar of an adventurer in the party screen
 */
const DroppableAdventurerAvatar = (props: Props & DropSourceProps) => {
    const { connectDropTarget } = props;

    return connectDropTarget(
        <div className="droppable-adventurer-avatar">
            <AdventurerAvatar
                adventurer = { props.adventurer }
                onClick = { props.onClick }
            />
        </div>,
    );
}

export default DropTarget<Props, DropSourceProps>(
    DragType.ITEM,
    dropTarget,
    collect,
)(DroppableAdventurerAvatar);
