import React from 'react';
import { AdventurerStoreState } from 'stores/adventurer';
import DraggableAdventurerAvatar from 'components/ui/DraggableAdventurerAvatar';
import { SOURCE_ID } from './TavernStructureView';

export interface Props {
    adventurer: AdventurerStoreState;
    onClick: (adventurer: AdventurerStoreState) => void;
    inParty: boolean;
    assigned: boolean;
    expanded: boolean;
}

// Room block that has adventurer
const RoomWithAdventurer = (props: Props) => {
    const {adventurer, inParty, assigned, onClick, expanded} = props;
    let name=adventurer.name;

    if (inParty) {
        name += " (on a quest)";
    }
    /*
    <button
        className="boot"
        key={ `boot:${adventurer.id}` }
    >
        Boot
    </button>,*/

    return (
        <>
            <div className={`room ${expanded ? "expanded" : ""}`}>
                <DraggableAdventurerAvatar
                    disabled={assigned || inParty}
                    adventurer={adventurer}
                    className="adventurer-icon"
                    sourceId={SOURCE_ID}
                    key={`avatar:${adventurer.id}`}
                />
                <span key={ adventurer.id } onClick={() => onClick(adventurer)}>{name}</span>
            </div>
            { expanded && (
                <div className="adventurer-details">
                    {adventurer.name}
                </div>
            )}
        </>
    );
}

export default RoomWithAdventurer;
