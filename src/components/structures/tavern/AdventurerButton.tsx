import * as React from "react";
import { AdventurerStoreState } from 'stores/adventurer';
import { AVAILABLE_SLOTS } from './QuestBoard';
import "./css/adventurerButton.css";

export interface Props {
    adventurer: AdventurerStoreState;
    assignedAventurers: AdventurerStoreState[];  // assigned to a quest in the QuestBoard

    onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void;
    onRemoveAdventurer: (adventurer: AdventurerStoreState) => void;
}

// Toggles adventurer participation in a quest
const AdventurerButton = (props: Props) => {
    const {
        adventurer,
        assignedAventurers,
        onAddAdventurer,
        onRemoveAdventurer
    } = props;

    const isAssigned = assignedAventurers.indexOf(adventurer) > -1;

    const handleAddClick = () => {
        const emptySlot = getEmptySlot(assignedAventurers);
        onAddAdventurer(adventurer, emptySlot);
    };

    const handleRemoveClick = () => {
        onRemoveAdventurer(adventurer);
    }

    if (isAssigned) {
        return (
            <button onClick={handleRemoveClick} className="adventurer-button">
                Leave
            </button>
        );
    }
    // Skip holes
    if (assignedAventurers.filter(Boolean).length === AVAILABLE_SLOTS) {
        return (
            <button disabled  className="adventurer-button">
                Party full
            </button>
        )
    }
    return (
        <button onClick={handleAddClick}  className="adventurer-button">
            Join
        </button>
    )
}

export default AdventurerButton;

// Finds the first array index with a falsey value
const getEmptySlot = (assignedAventurers: AdventurerStoreState[]) => {
    for (let i = 0; i < AVAILABLE_SLOTS; i++) {
        if (!assignedAventurers[i]) {
            return i;
        }
    }
    return 0;
}