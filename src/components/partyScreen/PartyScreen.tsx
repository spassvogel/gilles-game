
import { cloneDeep, isEqual } from "lodash";
import * as React from "react";
import { AnyAction, Dispatch } from "redux";
import { ContextType } from "src/constants";
import { EncounterDefinition } from "src/definitions/encounters/types";
import equipmentDefinitions from "src/definitions/equipment";
import questDefinitions, { QuestDefinition, QuestNode, QuestNodeType } from "src/definitions/quests";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";
import { AppContextProps } from "../App";
import AdventurerAvatar from "./AdventurerAvatar";
import "./css/partyscreen.css";
import EquipmentIcon, { InventoryItemDragInfo } from "./EquipmentIcon";
import InventorySlot from "./InventorySlot";

export interface StateProps {
    adventurers: AdventurerStoreState[];
    store: StoreState;
}

export interface Props {
    quest: QuestStoreState;
}

export interface DispatchProps {
    onDispatch: Dispatch<AnyAction>;
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

    public getAdventurerInfo(adventurer: AdventurerStoreState): any {
        const attributes = Object.keys(adventurer.stats).map((stat) => {
            const value: number = adventurer.stats[stat];
            return <div key= { `${adventurer.id}-${stat}`} > <b>{ stat }</b>: { value.toFixed(1) } </div>;
        });
        const gearList = Object.keys(adventurer.gear).map((gear) => {
            return <div key= { `${adventurer.id}-${gear}`} ><b>{ gear }</b>: { adventurer.gear[gear] }  </div>;
        });

        const inventory = [];

        for (let i = 0; i < adventurer.inventory.length; i++) {
            let contents;
            const item = adventurer.inventory[i];
            const handleDrop = (dragInfo: InventoryItemDragInfo) => {
                if (dragInfo.inventorySlot === i) {
                    return;
                }

                if (this.props.onMoveItemInInventory) {
                    const { inventorySlot: fromSlot} = dragInfo;
                    this.props.onMoveItemInInventory(adventurer.id, fromSlot!, i);
                }
            };

            if (item) {

                const handleClick = () => {
                    this.props.onContextualObjectActivated(
                        ContextType.item,
                        equipmentDefinitions[item],
                    );
                };

                contents = <EquipmentIcon
                    index = {i}
                    source = "adventurer"
                    item = { item }
                    onClick = { () => handleClick() }
                >
                </EquipmentIcon>;
            }

            // tslint:disable-next-line:max-line-length
            const slot = <InventorySlot
                key= { `inventory-slot-${i}`}
                empty = { contents === undefined }
                onDrop= { handleDrop }>
                 { contents }
            </InventorySlot>;
            inventory.push(slot);
        }

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
                <div className="inventory">
                    { inventory }
                </div>
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
            const questNode: QuestNode = questDefinition.nodes[quest.progress];

            let message = <p></p>;
            let actions = <p></p>;

            switch (questNode.type) {
                case QuestNodeType.nothing: {
                    if (quest.progress === 0) {
                        message = <p> { "The party has embarked on a new quest" } </p>;
                    } else {
                        message = <p> { "The party trudges on" } </p>;
                    }
                    break;
                }
                case QuestNodeType.encounter: {
                    if (quest.encounterResults[quest.progress]) {
                        message = <p> { quest.encounterResults[quest.progress] } </p>;
                        break;
                    }
                    const questVars = cloneDeep(this.props.quest.questVars);
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
