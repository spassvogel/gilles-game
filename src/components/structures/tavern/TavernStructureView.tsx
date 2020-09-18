import * as React from "react";
import { AdventurerAvatarDragInfo} from "components/ui/DraggableAdventurerAvatar";
import { getDefinition, Structure} from "definitions/structures";
import { TavernStructureDefinition, TavernStructureLevelDefinition} from "definitions/structures/types";
import { AdventurerStoreState} from "stores/adventurer";
import { QuestStatus, QuestStoreState} from "stores/quest";
import { TextManager} from "global/TextManager";
import { ToastManager} from 'global/ToastManager';
import { Type} from 'components/ui/toasts/Toast';
import { getQuestLink} from 'utils/routing';
import RoomList from './RoomList';
import { useState} from 'react';
import QuestBoard from './QuestBoard';
import useGoldState from 'hooks/store/useGold';
import useStructureState from 'hooks/store/useStructureState';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from 'stores';
import { launchQuest } from 'actions/quests';
import { subtractGold } from 'actions/gold';
import { upgradeStructure } from 'actions/structures';
import { addLogText } from 'actions/log';
import { LogChannel } from 'stores/logEntry';
import "./css/tavernstructureview.css";

export interface StateProps {
    gold: number;
    level: number;
    adventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}


export const SOURCE_ID = "tavern";

// The UI for the tavern
const TavernStructureView = (props: Props) => {
    const gold = useGoldState();
    const level = useStructureState(Structure.tavern).level;
    const adventurers = useSelector<StoreState, AdventurerStoreState[]>(store => store.adventurers);
    const quests = useSelector<StoreState, QuestStoreState[]>(store => store.quests);

    const [assignedAventurers, setAassignedAdventurers] = useState<AdventurerStoreState[]>([]);
    const [selectedQuest, setSelectedQuest] = useState<string>();

    const structureDefinition = getDefinition<TavernStructureDefinition>(Structure.tavern);
    const levelDefinition: TavernStructureLevelDefinition = structureDefinition.levels[level];
    const displayName = TextManager.getStructureName(Structure.tavern);

    const dispatch = useDispatch();

    const onLaunchQuest = (questName: string) => {
        dispatch(launchQuest(questName, assignedAventurers));
    };

    const onUpgrade = (cost: number) => {
        dispatch(subtractGold(cost));
        dispatch(upgradeStructure(Structure.tavern));  // Todo: [07/07/2019] time??

        dispatch(addLogText("log-town-upgrade-structure-complete", {
            level: level + 1,
            structure: Structure.tavern,
        }, LogChannel.town));
    };

    const createUpgradeRow = () => {

        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            onUpgrade(nextLevelCost);
        };

        return (
            <div>
                <label>level:</label>{ `${(level + 1)} / ${structureDefinition.levels.length}` }
                <button
                    style = {{ float: "right"}}
                    onClick={handleClick}
                    disabled= { !canUpgrade}
                >
                    { upgradeText}
                </button>
            </div>
        );
    };

    const getAvailableQuests = quests.filter((q) => q.status === QuestStatus.available );

    const handleQuestClick = (name: string): void => {
        if (selectedQuest === name) {
            setSelectedQuest(undefined);
        } else {
            setSelectedQuest(name);
        }

        // Unassign all adventurers
        setAassignedAdventurers([]);
    };

    const handleAdventurerDropped = (item: AdventurerAvatarDragInfo, index: number) => {
        if (item.sourceId === SOURCE_ID) {
            handleAddAdventurer(item.adventurer, index)
        }
    }

    const handleAddAdventurer = (adventurer: AdventurerStoreState, index: number): void => {
        const copy = [ ...assignedAventurers];
        copy[index] = adventurer;
        setAassignedAdventurers(copy);
    };

    const handleRemoveAdventurer = (adventurer: AdventurerStoreState): void => {
        const index = assignedAventurers.indexOf(adventurer);
        const copy = [ ...assignedAventurers];
        delete copy[index];
        setAassignedAdventurers(copy);
    };

    const handleLaunchQuest = (): void => {
        const questTitle = TextManager.getQuestTitle(selectedQuest!);
        const leader = assignedAventurers[0];
        ToastManager.addToast(questTitle, Type.questLaunched, leader?.avatarImg, getQuestLink(selectedQuest!));
        onLaunchQuest(selectedQuest!);
    };

    return (
        <details open={true} className="tavernstructureview">
            <summary>{displayName}</summary>
            {createUpgradeRow()}
            <section>
                <RoomList
                    roomCount={levelDefinition.rooms}
                    adventurers={adventurers}
                    assignedAventurers={assignedAventurers}
                    quests={quests}
                    selectedQuestName={selectedQuest}
                    onAddAdventurer={handleAddAdventurer}
                    onRemoveAdventurer={handleRemoveAdventurer}
                />
                <QuestBoard
                    availableQuests={getAvailableQuests}
                    selectedQuestName={selectedQuest}
                    assignedAventurers={assignedAventurers}
                    onQuestClick={(name: string) => handleQuestClick(name)}
                    onAdventurerDropped={handleAdventurerDropped}
                    onRemoveAdventurer={handleRemoveAdventurer}
                    onLaunchQuest={() => handleLaunchQuest()}
                />
            </section>
        </details>
    );
};

export default TavernStructureView;
