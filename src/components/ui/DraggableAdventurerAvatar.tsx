import { DragSourceType, DragType } from "constants/dragging";
import * as React from "react";
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from "react-dnd";
import { AdventurerStoreState } from "stores/adventurer";
import AdventurerAvatar, { Props as AdventurerAvatarProps } from "./AdventurerAvatar";
import "./css/draggableadventureravatar.css";

export interface Props {
    sourceId?: string;
    onClick?: () => void;
    disabled?: boolean;
}

interface CollectedProps {
    isDragging: boolean;
    connectDragSource: ConnectDragSource;
}

export interface AdventurerAvatarDragInfo {
    adventurer: AdventurerStoreState;
    sourceId?: string;
}

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const spec: DragSourceSpec<Props & AdventurerAvatarProps, AdventurerAvatarDragInfo> = {
    beginDrag(props: Props & AdventurerAvatarProps) {
        // Return the data describing the dragged item
        return {
            adventurer: props.adventurer,
            sourceId: props.sourceId,
            sourceType: DragSourceType.adventurerInventory,
        };
    },
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect: DragSourceConnector, monitor: DragSourceMonitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    };
}

const DraggableAdventurerAvatar = (props: Props & CollectedProps & AdventurerAvatarProps) => {

    const { isDragging, connectDragSource, disabled } = props;
    let className = "draggable-adventurer-avatar";
    if (disabled) {
        className += " disabled";
    }
    if (isDragging) {
        className += " dragging";
    }

    /*if (isDragging) {
        // TODO: can show some sort of empty state?
        return null;
    }*/
    return connectDragSource(
        <div className = { className }>
            <AdventurerAvatar
                // Copy all props down to AdventurerAvatar
                { ...props }
            />
        </div>,
    );
}

export default DragSource<Props & AdventurerAvatarProps, CollectedProps>(DragType.ADVENTURER, spec, collect)(DraggableAdventurerAvatar);
