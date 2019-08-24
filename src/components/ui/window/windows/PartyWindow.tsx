import { InventoryItemDragInfo } from "components/ui/DraggableItemIcon";
import DroppableAdventurerAvatar from "components/ui/DroppableAdventurerAvatar";
import { TextEntry } from "constants/text";
import AdventurerInfo from "containers/ui/AdventurerInfo";
import { getDefinition as getEncounterDefinition } from "definitions/encounters";
import { EncounterDefinition } from "definitions/encounters/types";
import { getDefinition as getQuestDefinition, QuestDefinition, QuestNode, QuestNodeType } from "definitions/quests";
import { AppContextProps } from "hoc/withAppContext";
import React from "react";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";
import { TextManager } from "utils/textManager";
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

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

// export default
class PartyWindow extends React.Component<AllProps, LocalState> {

    // This Component has local state, so it's a class
    constructor(props: AllProps) {
        super(props);
        this.state = {
            selectedAdventurer: null,
        };
    }

    public render() {
        return (
            <div className = "partywindow">
                <div className = "avatars">
                    { this.getAvatars() }
                </div>
                { this.getBottomPart() }
            </div>
        );
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.quest !== this.props.quest) {
            // The active quest has changed, so it doesn't make sense to keep any adventurer selected
            this.setState({
                selectedAdventurer: null,
            });
        }
    }

    private getAdventurerInfo(adventurer: AdventurerStoreState): any {
        if (!adventurer) {
            return null;
        }
        return <AdventurerInfo adventurerId = { adventurer.id } />;
    }

    private handleAvatarClick(adventurerId: string | null): void {
        if (this.state.selectedAdventurer === adventurerId) {
            adventurerId = null;
        }
        this.setState({
            selectedAdventurer: adventurerId,
        });
    }

    private handleEncounterOptionClick(encounter: EncounterDefinition, option: string, oracle: any): any {
        const result = encounter.answer(option, oracle, this.props.onDispatch);

        /*if (!isEqual(questVars, this.props.quest.questVars)){
            this.props.onUpdateQuestVars(questVars);
        }*/
        this.props.onUpdateEncounterResult(this.props.quest.progress, result);
       // this.props.onAdvanceQuest(this.props.quest.name);
    }

    private getAvatars = () => {
        return this.props.adventurers.map((adventurer: AdventurerStoreState) => {
            const handleDropItem = (dragInfo: InventoryItemDragInfo) => {
                const fromAdventurer = this.state.selectedAdventurer!; // The adventurer that has the item
                if (adventurer.id === fromAdventurer) {
                    // Dropping on yourself.. nothing happens
                    return;
                }

                if (this.props.onMoveItemToOtherAdventurer) {
                    const {
                        inventorySlot: fromSlot,
                    } = dragInfo;
                    this.props.onMoveItemToOtherAdventurer(fromAdventurer, fromSlot!, adventurer.id);
                }
            };

            const selected = this.state.selectedAdventurer === adventurer.id;
            return <DroppableAdventurerAvatar
                key = { `${adventurer.id}-avatar` }
                className = { (selected ? " selected" : "") }
                adventurer = { adventurer }
                onClick = { () => this.handleAvatarClick(adventurer.id) }
                onDrop = { handleDropItem }
            />;
        });
    }

    private getBottomPart = () => {

        if (this.state.selectedAdventurer) {
            const adventurer: AdventurerStoreState = this.props.adventurers
                .find((a) => a.id === this.state.selectedAdventurer)!;
            return this.getAdventurerInfo(adventurer);
        } else {
            const quest = this.props.quest;
            const questDefinition: QuestDefinition = getQuestDefinition(quest.name);
            const progress: number = Math.floor(quest.progress);
            const questNode: QuestNode = questDefinition.nodes[progress];

            let message = <p></p>;
            let actions = <p></p>;

            switch (questNode.type) {
                case QuestNodeType.nothing: {
                    message = <div> {
                        this.props.lastLog && TextManager.getTextEntry(this.props.lastLog)
                    } </div>;
                    break;
                }
                case QuestNodeType.encounter: {
                    // if (quest.encounterResults[quest.progress]) {
                    //     message = <p> { quest.encounterResults[quest.progress] } </p>;
                    //     break;
                    // }
                    const store = this.props.store;
                    const encounter = getEncounterDefinition(quest.currentEncounter!);
                    const oracle = encounter.getOracle(quest.name, store);
                    const descriptionTextEntry = encounter.getDescription(oracle);
                    const descriptionText = TextManager.getTextEntry(descriptionTextEntry);

                    message = <div><p> { descriptionText } </p></div>;

                    const options = encounter.getOptions(oracle);

                    actions = <ul>
                        { Object.keys(options).map((o) => <li key={ o }>
                            <button onClick= { () => this.handleEncounterOptionClick(encounter, o, oracle) }>
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
}

export default PartyWindow;
