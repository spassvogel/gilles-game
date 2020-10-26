import React, { useState } from 'react';
import { AdventurerStoreState } from 'store/types/adventurer';
import { QuestStoreState } from 'store/types/quest';
import RoomWithAdventurer from './RoomWithAdventurer';
import RoomEmpty from './RoomEmpty';
import { TextManager } from 'global/TextManager';
import "./styles/roomList.scss";

export interface Props {
    roomCount: number;
    adventurers: AdventurerStoreState[];
    assignedAventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
    selectedQuestName?: string;       // name of selected quest

    onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void;
    onRemoveAdventurer: (adventurer: AdventurerStoreState) => void;
}

const RoomList = (props: Props) => {
    const {
        roomCount,
        adventurers,
        assignedAventurers,
        selectedQuestName,
        onAddAdventurer,
        onRemoveAdventurer
    } = props;
    const [selectedAdventurer, setSelectedAdventurer] = useState<string>();

    const getQuestByAdventurer = (adventurerId: string): QuestStoreState | undefined => {
        return Object.values(props.quests).find((quest) => {
            return quest.party.indexOf(adventurerId) > -1;
        });
    };

    const handleAdventurerNameClick = (adventurer: AdventurerStoreState) => {
        if (selectedAdventurer === adventurer.id) {
            setSelectedAdventurer(undefined);
        } else {
            setSelectedAdventurer(adventurer.id);
        }
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
        const onQuest = !!getQuestByAdventurer(adventurer.id);

        roomContent.push((
            <RoomWithAdventurer
                key={adventurer.id}
                adventurer={adventurer}
                assignedAventurers={assignedAventurers}
                selectedQuestName={selectedQuestName}
                expanded={selectedAdventurer === adventurer.id}
                onQuest={onQuest}

                onClick={handleAdventurerNameClick}
                onAddAdventurer={onAddAdventurer}
                onRemoveAdventurer={onRemoveAdventurer}
            />
        ));
    }

    return (
        <div className="room-list">
            <h2>{TextManager.get("ui-structure-tavern-rooms")}</h2>
            { roomContent }
        </div>
    );
}

export default RoomList;