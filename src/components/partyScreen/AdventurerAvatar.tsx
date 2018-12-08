import * as React from "react";
import { ConnectDropTarget, DropTarget, DropTargetConnector, DropTargetMonitor, DropTargetSpec } from "react-dnd";
import { DragType } from "src/constants";
import { AdventurerStoreState } from "src/stores/adventurer";

const dropTarget: DropTargetSpec<Props> = {
    drop(props: Props, monitor: DropTargetMonitor) {
        props.onDrop(monitor.getItem());
    },
    canDrop(props: Props, monitor: DropTargetMonitor)  {
        return true; // todo: can't drop on yourself
    },
};

export interface Props {
    active: boolean;
    adventurer: AdventurerStoreState;
    onDrop: (item: any) => void;
    onClick: (adventurerId: string) => void;
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
class AdventurerAvatar extends React.Component<Props & DropSourceProps> {
    public render() {
        const {
            active,
            adventurer,
            isOver,
            canDrop,
            connectDropTarget,
        } = this.props;
        const isActive = isOver && canDrop;

        return connectDropTarget(
            <div className = { "avatar" + (active ? " selected" : "")}
                onClick = { () => this.handleClick()  }>
                <img src= { adventurer.avatarImg } />
                <div className="name">
                    { adventurer.name }
                </div>
            </div>,
        );
    }

    private handleClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.adventurer.id);
        }
    }
}

export default DropTarget<Props, DropSourceProps>(
    DragType.EQUIPMENT,
    dropTarget,
    collect,
)(AdventurerAvatar);
