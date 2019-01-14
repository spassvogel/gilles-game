
import * as React from "react";
import { AnyAction, Dispatch } from "redux";
import { EncounterDefinition } from "src/definitions/encounters/types";
import questDefinitions, { QuestDefinition, QuestNode, QuestNodeType } from "src/definitions/quests";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";
import { AppContextProps } from "../App";
import { InventoryItemDragInfo } from "../ui/DraggableItemIcon";
import Inventory from "../ui/inventory/Inventory";
import AdventurerAvatar from "./AdventurerAvatar";
import "./css/partyscreen.css";

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
class PartyScreen extends React.Component<AllProps, LocalState> {

    // This Component has local state, so it's a class
    constructor(props: AllProps) {
        super(props);
        this.state = {
            selectedAdventurer: null,
        };
    }

    public render() {
        const questDefinition: QuestDefinition = questDefinitions[this.props.quest.name];

        return (
        <div className="partyscreen">
            <div className="header">
                { questDefinition.displayName }
            </div>
            <div className="avatars">
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
        const gearList = Object.keys(adventurer.gear).map((gear) => {
            return <div key= { `${adventurer.id}-${gear}`} ><b>{ gear }</b>: { adventurer.gear[gear] }  </div>;
        });

        const handleMoveItem = (fromSlot: number, toSlot: number): void => {
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
                <div className="gear">
                    { gearList }
                </div>
            </div>
            <div className="right">
                <Inventory source="adventurer"
                    items={ adventurer.inventory }

                    onMoveItem = { handleMoveItem }
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

    private handleEncounterOptionClick(encounter: EncounterDefinition<any>, option: string, oracle: any): any {
        const result = encounter.answer(option, oracle, this.props.onDispatch);

        /*if (!isEqual(questVars, this.props.quest.questVars)){
            this.props.onUpdateQuestVars(questVars);
        }*/
        this.props.onUpdateEncounterResult(this.props.quest.progress, result);
        this.props.onAdvanceQuest(this.props.quest.name);
    }

    private getAvatars = () => {
        return this.props.adventurers.map((adventurer: AdventurerStoreState) => {
            const handleDrop = (dragInfo: InventoryItemDragInfo) => {
                const fromAdventurer = this.state.selectedAdventurer!; // The adventurer that has the item
                if (adventurer.id === fromAdventurer) {
                    // Dropping on yourself.. nothing happens
                    return;
                }

                if (this.props.onMoveItemToOtherAdventurer) {
                    const { inventorySlot: fromSlot} = dragInfo;
                    this.props.onMoveItemToOtherAdventurer(fromAdventurer, fromSlot!, adventurer.id);
                }
            };

            const active = this.state.selectedAdventurer === adventurer.id;
            return <AdventurerAvatar
                key = { `${adventurer.id}-avatar` }
                active = { active }
                adventurer = { adventurer }
                onClick = { () => this.handleAvatarClick(adventurer.id) }
                onDrop = { handleDrop }
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
            const questDefinition: QuestDefinition = questDefinitions[quest.name];
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
                    // if (quest.progress === 0) {
                    //     message = <p> { "The party has embarked on a new quest" } </p>;
                    // } else {
                    //     message = <p> { "The party trudges on" } </p>;
                    // }
                    break;
                }
                case QuestNodeType.encounter: {
                    if (quest.encounterResults[quest.progress]) {
                        message = <p> { quest.encounterResults[quest.progress] } </p>;
                        break;
                    }
                    const store = this.props.store;
                    const encounter = questNode.encounter!;
                    const oracle = encounter.getOracle(quest.name, store);

                    message = <div><p> {encounter.getTitle(oracle)} </p>
                        <p> {encounter.getDescription(oracle)}</p></div>;

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

export default (PartyScreen);
