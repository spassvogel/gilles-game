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

// tslint:disable-next-line:no-empty-interface
interface LocalState {
}

export default class QuestBoard extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            selectedQuest: null,
        };
    }

    public render() {
        const questListContent: JSX.Element[] = this.props.availableQuests.map((q) => {
            const iconImgPath = `img/sigils/${ q.icon }`;
            const className = "quest" + ((q.name === this.props.selectedQuestName) ? " selected" : "");
            return <li key={ q.name } className = { className } onClick = { () => { this.props.onQuestClick(q.name); } }>
                <div
                    className = "icon"
                    style={{backgroundImage: `url(${iconImgPath})`}}
                ></div>
                <div className = "title">{ TextManager.getQuestTitle(q.name) } </div>
            </li>;
        });

        const getQuestDetails = () => {
            if (!this.props.selectedQuestName) {
                return null;
            }
            const quest = this.props.availableQuests.find((q) => q.name === this.props.selectedQuestName);
            if (!quest) {
                return <div> { TextManager.get("structure-tavern-quest-launched") } </div>;
            }
            const questDefinition = getDefinition(quest.name);

            // Need a full party to launch
            const fullParty = this.props.assignedAventurers.filter((a) => a !== null).length >= minimumCountAdventurers;
            // Check if we have the required items
            const enoughItems = this.checkEnoughItems(questDefinition);

            const canLaunch = fullParty && enoughItems;

            return <div className="quest-details">
                { TextManager.getQuestDescription(this.props.selectedQuestName) }
                <AssignAdventurers
                    availableSlots = { availableSlots }
                    assignedAventurers = { this.props.assignedAventurers }
                    onRemoveAdventurer = { this.props.onRemoveAdventurer }
                    onAddEventurer = { this.props.onAddAdventurer } />
                <ItemsCostBox items = { questDefinition.requiredItems || [] }/>
                <button disabled = { !canLaunch } onClick = { () => this.props.onLaunchQuest() }>
                    { TextManager.get("structure-tavern-button-launch-quest") }
                </button>
            </div>;
        };

        // quest board, expanded quest info + assign adventurers + launch button
        return <div className = "quest-board">
            <h2> { TextManager.get("structure-tavern-title-quest-board") } </h2>
            <ul className = "quest-list">
                { questListContent }
            </ul>
            { getQuestDetails() }
        </div>;
    }

    /**
     * Returns true if all the items required by the quest are in the inventory
     */
    public checkEnoughItems(questDefinition: QuestDefinition): boolean {
        if (!questDefinition.requiredItems) {
            return true;
        }
        return questDefinition.requiredItems.every((item: Item) => {
            const amountRequired = (questDefinition.requiredItems)!.filter((i) => i === item).length;
            return this.props.items.filter((i) => i === item).length >= amountRequired;
        });
    }
}
