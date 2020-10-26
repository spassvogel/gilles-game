import React from 'react';
import { AdventurerStoreState } from 'store/types/adventurer';
import { SOURCE_ID } from './TavernStructureView';
import AdventurerButton from './AdventurerButton';
import { TextManager } from 'global/TextManager';
import DraggableAdventurerAvatar from 'components/ui/adventurer/DraggableAdventurerAvatar';
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel';

export interface Props {
    adventurer: AdventurerStoreState;
    onQuest: boolean;
    assignedAventurers: AdventurerStoreState[];
    expanded: boolean;
    selectedQuestName?: string;

    onClick: (adventurer: AdventurerStoreState) => void;
    onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void;
    onRemoveAdventurer: (adventurer: AdventurerStoreState) => void;
}

// Room block that has adventurer
const RoomWithAdventurer = (props: Props) => {
    const {
        adventurer,
        onQuest,
        assignedAventurers,
        expanded,
        selectedQuestName,
        onClick,
        onAddAdventurer,
        onRemoveAdventurer
    } = props;
    /*
    <button
        className="boot"
        key={ `boot:${adventurer.id}` }
    >
        Boot
    </button>,*/
    const assigned = assignedAventurers.indexOf(adventurer) > -1; // assigned to a quest in the QuestBoard

    return (
        <>
            <div className={`room ${expanded ? "expanded" : ""}`}>
                <DraggableAdventurerAvatar
                    disabled={assigned || onQuest}
                    adventurer={adventurer}
                    className="adventurer-icon"
                    sourceId={SOURCE_ID}
                    key={`avatar:${adventurer.id}`}
                />
                <span key={ adventurer.id } onClick={() => onClick(adventurer)}>
                    {adventurer.name}
                    {(onQuest) && TextManager.get("ui-structure-tavern-on-a-quest") }
                </span>
            </div>
            { expanded && (
                <div className="adventurer-details">
                    <AdventurerPanel adventurerId={adventurer.id} name={false} />
                    { (!onQuest && selectedQuestName) && (
                        <AdventurerButton
                            adventurer={adventurer}
                            assignedAventurers={assignedAventurers}
                            questName={selectedQuestName}
                            onAddAdventurer={onAddAdventurer}
                            onRemoveAdventurer={onRemoveAdventurer}
                        />
                    )}
                </div>
            )}
        </>
    );
}

export default RoomWithAdventurer;
