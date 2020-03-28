import { AdventurerAvatarDragInfo } from "components/ui/DraggableAdventurerAvatar";
import ItemsCostBox from "containers/ui/context/items/ItemsCostBox";
import { Item } from "definitions/items/types";
import { getDefinition, QuestDefinition } from "definitions/quests";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";
import { TextManager } from "utils/textManager";
import AssignAdventurers from "./AssignAdventurers";
import "./css/questboard.css";

const availableSlots = 5;
const minimumCountAdventurers = 3;  // we need this many adventurers to start the quest

export interface StateProps {
    items: Array<Item | null>;  // items in inventory
}

// tslint:disable-next-line: no-empty-interface
export interface DispatchProps {}

export interface Props {
    availableQuests: QuestStoreState[];
    selectedQuestName: string | null;       // name of selected quest
    assignedAventurers: AdventurerStoreState[];

    onQuestClick: (questName: string) => void;
    onRemoveAdventurer: (index: number) => void;
    onAddAdventurer: (item: AdventurerAvatarDragInfo, index: number) => void;
    onLaunchQuest: () => void;
}

type AllProps = Props & DispatchProps & StateProps;

const QuestBoard = (props: AllProps) => {

    const questListContent: JSX.Element[] = props.availableQuests.map((q) => {
        const iconImgPath = `${process.env.PUBLIC_URL}img/sigils/${q.icon }`;
        const className = "quest" + ((q.name === props.selectedQuestName) ? " selected" : "");
        return <li key={ q.name } className = { className } onClick = { () => { props.onQuestClick(q.name); } }>
            <div
                className = "icon"
                style={{backgroundImage: `url(${process.env.PUBLIC_URL}${iconImgPath})`}}
            ></div>
            <div className = "title">{ TextManager.getQuestTitle(q.name) } </div>
        </li>;
    });

    const getQuestDetails = () => {
        if (!props.selectedQuestName) {
            return null;
        }
        const quest = props.availableQuests.find((q) => q.name === props.selectedQuestName);
        if (!quest) {
            return <div> { TextManager.get("structure-tavern-quest-launched") } </div>;
        }
        const questDefinition = getDefinition(quest.name);

        // Need a full party to launch
        const fullParty = props.assignedAventurers.filter((a) => a !== null).length >= minimumCountAdventurers;
        // Check if we have the required items
        const enoughItems = checkEnoughItems(questDefinition);

        const canLaunch = fullParty && enoughItems;

        return <div className="quest-details">
            { TextManager.getQuestDescription(props.selectedQuestName) }
            <AssignAdventurers
                availableSlots = { availableSlots }
                assignedAventurers = { props.assignedAventurers }
                onRemoveAdventurer = { props.onRemoveAdventurer }
                onAddEventurer = { props.onAddAdventurer } />
            <ItemsCostBox items = { questDefinition.requiredItems || [] }/>
            <button disabled = { !canLaunch } onClick = { () => props.onLaunchQuest() }>
                { TextManager.get("structure-tavern-button-launch-quest") }
            </button>
        </div>;
    };

    /**
     * Returns true if all the items required by the quest are in the inventory */
    const checkEnoughItems = (questDefinition: QuestDefinition): boolean => {
        if (!questDefinition.requiredItems) {
            return true;
        }
        return questDefinition.requiredItems.every((item: Item) => {
            const amountRequired = (questDefinition.requiredItems)!.filter((i) => i === item).length;
            return props.items.filter((i) => i === item).length >= amountRequired;
        });
    }

    // quest board, expanded quest info + assign adventurers + launch button
    return (
        <div className = "quest-board">
            <h2> { TextManager.get("structure-tavern-title-quest-board") }</h2>
            <ul className = "quest-list">
                { questListContent }
            </ul>
            { getQuestDetails() }
        </div>
    );
}

export default QuestBoard;
