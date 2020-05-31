import { AdventurerAvatarDragInfo } from "components/ui/DraggableAdventurerAvatar";
import QuestBoard from "containers/structures/tavern/QuestBoard";
import { getDefinition, Structure } from "definitions/structures";
import { TavernStructureDefinition, TavernStructureLevelDefinition } from "definitions/structures/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { TextManager } from "global/TextManager";
import "./css/tavernstructureview.css";
import { AppContext } from "components/App";
import AdventurerInfoWindow from "components/ui/window/windows/AdventurerInfoWindow";
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLink } from 'utils/routing';
import RoomList from './RoomList';
import { useState } from 'react';

// The UI for the tavern
export interface DispatchProps {
    onLaunchQuest: (questName: string, assignedAventurers: AdventurerStoreState[]) => void;
    onUpgrade?: (cost: number, level: number) => void;
}

export interface StateProps {
    gold: number;
    level: number;
    adventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

type AllProps = Props & StateProps & DispatchProps;

// tslint:disable-next-line:no-empty-interface

export const SOURCE_ID = "tavern";

const TavernStructureView = (props: AllProps) => {
    const {adventurers, quests} = props;
    const [assignedAventurers, setAassignedAdventurers] = useState<AdventurerStoreState[]>([]);
    const [selectedQuest, setSelectedQuest] = useState<string | null>(null);

    const structureDefinition = getDefinition<TavernStructureDefinition>(Structure.tavern);
    const level: number = props.level || 0;
    const levelDefinition: TavernStructureLevelDefinition = structureDefinition.levels[level];
    const displayName = TextManager.getStructureName(Structure.tavern);

    const createUpgradeRow = () => {
        const gold = props.gold;
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onUpgrade) { props.onUpgrade(nextLevelCost, level + 1); }
        };
        return <div>
            <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
            <button
                style = {{ float: "right" }}
                onClick={handleClick }
                disabled= { !canUpgrade }
            >
                { upgradeText }
            </button>
        </div>;
    };
    

    const getAvailableQuests = props.quests.filter((q) => q.status === QuestStatus.available );


    const handleQuestClick = (name: string) => {
        if (selectedQuest === name) {
            setSelectedQuest(null);
        } else {
            setSelectedQuest(name);
        }

        // Unassign all adventurers
        setAassignedAdventurers([]);
    };

    const handleAddAdventurer = (item: AdventurerAvatarDragInfo, index: number) => {
        if (item.sourceId === SOURCE_ID) {
            const copy = [ ...assignedAventurers];
            copy[index] = item.adventurer;
            setAassignedAdventurers(copy);
        }
    };

    const handleRemoveAdventurer = (index: number): void => {
        const copy = [ ...assignedAventurers];
        delete copy[index];
        setAassignedAdventurers(copy);
    };

    const handleLaunchQuest = (): void => {
        const questTitle = TextManager.getQuestTitle(selectedQuest!);
        const leader = assignedAventurers[0];
        ToastManager.addToast(questTitle, Type.questLaunched, leader?.avatarImg, getQuestLink(selectedQuest!));
        props.onLaunchQuest(selectedQuest!, assignedAventurers);
    };

    return (
        <details open className = "tavernstructureview">
            <summary>{ displayName }</summary>
            { createUpgradeRow() }
            <section>
                <RoomList 
                    roomCount={levelDefinition.rooms}
                    adventurers={adventurers}
                    assignedAventurers={assignedAventurers}
                    quests={quests}
                />
                <QuestBoard
                    availableQuests={getAvailableQuests }
                    selectedQuestName={selectedQuest }
                    assignedAventurers={assignedAventurers }
                    onQuestClick={(name: string) => handleQuestClick(name) }
                    onAddAdventurer={(item: AdventurerAvatarDragInfo, index: number) => handleAddAdventurer(item, index) }
                    onRemoveAdventurer={(index: number) => handleRemoveAdventurer(index) }
                    onLaunchQuest={() => handleLaunchQuest() }
                />
            </section>
        </details>
    );
};

export default TavernStructureView;
