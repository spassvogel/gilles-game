import React, { useState, useContext } from 'react';
import { AdventurerStoreState } from 'stores/adventurer';
import { QuestStoreState } from 'stores/quest';
import DraggableAdventurerAvatar from 'components/ui/DraggableAdventurerAvatar';
import { SOURCE_ID } from './TavernStructureView';
import { AppContext } from 'components/App';
import RoomWithAdventurer from './RoomWithAdventurer';
import RoomEmpty from './RoomEmpty';

export interface Props {
    roomCount: number;
    adventurers: AdventurerStoreState[];
    assignedAventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
}

const RoomList = (props: Props) => {
    const {roomCount, adventurers, assignedAventurers} = props;
    const context = useContext(AppContext);
    const [selectedAdventurer, setSelectedAdventurer] = useState<string>();

    const getQuestByAdventurer = (adventurerId: string): QuestStoreState | undefined => {
        return Object.values(props.quests).find((quest) => {
            return quest.party.indexOf(adventurerId) > -1;
        });
    };

    const handleAdventurerNameClick = (adventurer: AdventurerStoreState) => {
        setSelectedAdventurer(adventurer.id);
    };

    const roomContent: JSX.Element[] = [];
    for (let i = 0; i < roomCount; i++) {
        const adventurer = adventurers.find((a) => a.room === i);
        if (!adventurer) {
            roomContent.push((
                <RoomEmpty key={`room${i}`} />
            ));
            continue;
        }
        const assigned = assignedAventurers.indexOf(adventurer) > -1; // assigned to a quest in the QuestBoard
        const party = getQuestByAdventurer(adventurer.id);

        roomContent.push((
            <RoomWithAdventurer 
                adventurer={adventurer}
                assigned={assigned}
                onClick={handleAdventurerNameClick}
                expanded={selectedAdventurer === adventurer.id}
                inParty={!!party}
            />
        ));
    }   

    return (
        <div className="rooms">
            <h2>Rooms</h2>
            { roomContent }
        </div>
    );
}

export default RoomList;