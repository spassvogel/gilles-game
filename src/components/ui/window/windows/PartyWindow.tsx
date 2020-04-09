// todo: obsolete in favour of QuestPanel
import { InventoryItemDragInfo } from "components/ui/DraggableItemIcon";
import DroppableAdventurerAvatar from "components/ui/DroppableAdventurerAvatar";
import { TextEntry } from "constants/text";
import AdventurerInfo from "containers/ui/AdventurerInfo";
import { getDefinition as getEncounterDefinition } from "definitions/encounters";
import { EncounterDefinition } from "definitions/encounters/types";
import { getDefinition as getQuestDefinition, QuestDefinition, QuestNode, QuestNodeType } from "definitions/quests";
import React, { useState } from "react";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";
import { TextManager } from "global/TextManager";
import "./css/partywindow.css";

export interface StateProps {
    adventurers: AdventurerStoreState[];
    store: StoreState;
    lastLog?: TextEntry;
}

export interface Props {
    quest: QuestStoreState;
}

export interface DispatchProps {
    onDispatch: Dispatch<AnyAction>;
    onAdvanceQuest: (quest: string) => void;
    onUpdateEncounterResult: (nodeIndex: number, result: string) => void;
    onMoveItemInInventory?: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onMoveItemToOtherAdventurer?: (fromAdventurerId: string, fromSlot: number, toAdventurerId: string) => void;
}

interface LocalState {
    selectedAdventurer: string | null;
}

type AllProps = Props & StateProps & DispatchProps;

// export default
const PartyWindow = (props: AllProps) => {

    const [selectedAdventurer, setSelectedAdventurer] = useState<string | null>(null);

    // public componentDidUpdate(prevProps: Props) {
    //     if (prevProps.quest !== props.quest) {
    //         // The active quest has changed, so it doesn't make sense to keep any adventurer selected
    //         setState({
    //             selectedAdventurer: null,
    //         });
    //     }
    // }

    const handleAvatarClick = (adventurerId: string | null): void => {
        if (selectedAdventurer === adventurerId) {
            adventurerId = null;
        }
        setSelectedAdventurer(adventurerId);
    }

    const handleEncounterOptionClick = (encounter: EncounterDefinition, option: string, oracle: any): any => {
        const result = encounter.answer(option, oracle, props.onDispatch);

        /*if (!isEqual(questVars, props.quest.questVars)){
            props.onUpdateQuestVars(questVars);
        }*/
        props.onUpdateEncounterResult(props.quest.progress, result);
       // props.onAdvanceQuest(props.quest.name);
    }

    const getAvatars = () => {
        return props.adventurers.map((adventurer: AdventurerStoreState) => {
            const handleDropItem = (dragInfo: InventoryItemDragInfo) => {
                const fromAdventurer = selectedAdventurer!; // The adventurer that has the item
                if (adventurer.id === fromAdventurer) {
                    // Dropping on yourself.. nothing happens
                    return;
                }

                if (props.onMoveItemToOtherAdventurer) {
                    const {
                        inventorySlot: fromSlot,
                    } = dragInfo;
                    props.onMoveItemToOtherAdventurer(fromAdventurer, fromSlot!, adventurer.id);
                }
            };

            const selected = selectedAdventurer === adventurer.id;
            return <DroppableAdventurerAvatar
                key = { `${adventurer.id}-avatar` }
                className = { (selected ? " selected" : "") }
                adventurer = { adventurer }
                onClick = { () => handleAvatarClick(adventurer.id) }
                onDrop = { handleDropItem }
            />;
        });
    }

    const getBottomPart = () => {

        if (selectedAdventurer) {
            const adventurer: AdventurerStoreState = props.adventurers
                .find((a) => a.id === selectedAdventurer)!;
            return <AdventurerInfo adventurerId = { adventurer.id } />;
        } else {
            const quest = props.quest;
            const questDefinition: QuestDefinition = getQuestDefinition(quest.name);
            const progress: number = Math.floor(quest.progress);
            const questNode: QuestNode = questDefinition.nodes[progress];

            let message = <p></p>;
            let actions = <p></p>;

            switch (questNode.type) {
                case QuestNodeType.nothing: {
                    message = <div> {
                        props.lastLog && TextManager.getTextEntry(props.lastLog)
                    } </div>;
                    break;
                }
                case QuestNodeType.encounter: {
                    // if (quest.encounterResults[quest.progress]) {
                    //     message = <p> { quest.encounterResults[quest.progress] } </p>;
                    //     break;
                    // }
                    const store = props.store;
                    const encounter = getEncounterDefinition(quest.currentEncounter!);
                    const oracle = encounter.getOracle(quest.name, store);
                    const descriptionTextEntry = encounter.getDescription(oracle);
                    const descriptionText = TextManager.getTextEntry(descriptionTextEntry);

                    message = <div><p> { descriptionText } </p></div>;

                    const options = encounter.getOptions(oracle);

                    actions = <ul>
                        { Object.keys(options).map((o) => <li key={ o }>
                            <button onClick= { () => handleEncounterOptionClick(encounter, o, oracle) }>
                                { o }
                            </button>{ options[o]}
                        </li>)}
                    </ul>;

                    break;
                }
                case QuestNodeType.boss: {
                    message = <p> { "Boss fight!" } </p>;
                    break;
                }
            }

            return (
            <div className="questlog">
                { message }
                <div className="actions">
                    { actions}
                </div>
            </div>);
        }
    }

    return (
        <div className = "partywindow">
            <div className = "avatars">
                { getAvatars() }
            </div>
            { getBottomPart() }
        </div>
    );
}


export default PartyWindow;
