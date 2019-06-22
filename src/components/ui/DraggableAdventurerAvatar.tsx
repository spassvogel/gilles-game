import * as React from "react";
import { ConnectDragSource, DragSource, DragSourceConnector, DragSourceMonitor, DragSourceSpec } from "react-dnd";
import { DragSourceType, DragType } from "src/constants";
import { AdventurerStoreState } from "src/stores/adventurer";
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
const source: DragSourceSpec<Props & AdventurerAvatarProps, AdventurerAvatarDragInfo> = {
    beginDrag(props: Props & AdventurerAvatarProps) {
        // Return the data describing the dragged item
        return {
            adventurer: props.adventurer,
            sourceId: props.sourceId,
            sourceType: DragSourceType.adventurer,
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

class DraggableAdventurerAvatar extends React.Component<Props & CollectedProps & AdventurerAvatarProps> {

    public render() {
        const { onClick, isDragging, connectDragSource, disabled } = this.props;
        let className = "draggable-adventurer-avatar";
        if (disabled) {
            className += " disabled";
        }

        if (isDragging) {
            // TODO: can show some sort of empty state?
            return null;
        }
        return connectDragSource(
            <div className = { className }>
                <AdventurerAvatar
                    // Copy all props down to AdventurerAvatar
                    { ...this.props }
                />
            </div>,
        );
    }
}

export default DragSource<Props, CollectedProps>(DragType.ADVENTURER, source, collect)(DraggableAdventurerAvatar);
