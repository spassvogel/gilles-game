import * as React from "react";
import AdventurerAvatar from "src/components/ui/AdventurerAvatar";
import { AdventurerAvatarDragInfo } from "src/components/ui/DraggableAdventurerAvatar";
import DroppableAdventurerSlot from "src/components/ui/DroppableAdventurerSlot";
import { AdventurerStoreState } from "src/stores/adventurer";
import "./css/assignadventurers.css";

export interface DispatchProps {
    onRemoveAdventurer: (index: number) => void;
    onDropAdventurer: (item: AdventurerAvatarDragInfo, index: number) => void;
}

export interface Props {
    availableSlots: number;
    assignedAventurers: AdventurerStoreState[];
}

/*
 * Displays a number of slots to drag adventurers to */
const AssignAdventurers = (props: Props & DispatchProps) => {
    const slotsContent = () => {
        const slots: JSX.Element[] = [];
        for (let i = 0; i < props.availableSlots; i++) {
            let content;
            let className = "";
            const hasAdventurer = !!props.assignedAventurers[i];

            if (hasAdventurer) {
                const adventurer = props.assignedAventurers[i];
                content = <AdventurerAvatar adventurer = { adventurer } displayName = { false } onClick = { () => props.onRemoveAdventurer(i) }/> ;
                className = "has-adventurer";
            } else {
                content = <DroppableAdventurerSlot onDrop = { (item: AdventurerAvatarDragInfo) => { props.onDropAdventurer(item, i); }} />;
            }
            slots.push(<li key = { `slot${i}`} className = { className }> { content } </li>);
        }
        return slots;
    };

    return <ul className = "assign-adventurers">
        { slotsContent() }
    </ul>;
};

export default AssignAdventurers;
