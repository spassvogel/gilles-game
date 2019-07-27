import { InventoryItemDragInfo } from "components/ui/DraggableItemIcon";
import DroppableAdventurerAvatar from "components/ui/DroppableAdventurerAvatar";
import Inventory from "components/ui/inventory/Inventory";
import { DragSourceType } from "constants/dragging";
import { getDefinition as getEncounterDefinition } from "definitions/encounters";
import { EncounterDefinition } from "definitions/encounters/types";
import { Item } from "definitions/items/types";
import { getDefinition as getQuestDefinition, QuestDefinition, QuestNode, QuestNodeType } from "definitions/quests";
import { AppContextProps } from "hoc/withAppContext";
import React from "react";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";
import "./css/partywindow.css";
import { TextManager } from "utils/textManager";

export interface StateProps {
    adventurers: AdventurerStoreState[];
    store: StoreState;
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
        const attributes = Object.keys(adventurer.stats).map((stat) => {
            const value: number = adventurer.stats[stat];
            return <div key= { `${adventurer.id}-${stat}`} > <b>{ stat }</b>: { value.toFixed(1) } </div>;
        });
        const equipmentList = Object.keys(adventurer.equipment).map((equipment) => {
            return <div key= { `${adventurer.id}-${equipment}`} ><b>{ equipment }</b>: { adventurer.equipment[equipment] }  </div>;
        });

        const handleDropItem = (item: Item, fromSlot: number, toSlot: number): void => {
            // TODO: what if the source is NOT adventurer?
            if (this.props.onMoveItemInInventory) {
                this.props.onMoveItemInInventory(adventurer.id, fromSlot, toSlot);
            }
        };

        return (
        <div className="adventurer-container">
            <div className="left">
                <div className="name">
                    <b>{ adventurer.name }</b>
                </div>
                <div className="attributes">
                    { attributes }
                </div>
                <div className="equipment">
                    { equipmentList }
                </div>
            </div>
            <div className="right">
                <Inventory sourceType = { DragSourceType.adventurer }
                    items = { adventurer.inventory }
                    onDropItem = { handleDropItem }
                />
            </div>
        </div>
        );
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
                    const log = [ ...quest.log].reverse();
                    message = <div> {
                        log.map((entry) => {
                            return <p> { entry } </p>;
                        })
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
