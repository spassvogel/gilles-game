import * as React from "react";
import { AdventurerAvatarDragInfo } from "src/components/ui/DraggableAdventurerAvatar";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";
import { TextManager } from "src/utils/textManager";
import AssignAdventurers from "./AssignAdventurers";
import "./css/questboard.css";

export interface DispatchProps {
    onQuestClick: (questName: string) => void;
    onRemoveAdventurer: (index: number) => void;
    onAddAdventurer: (item: AdventurerAvatarDragInfo, index: number) => void;
}

export interface Props {
    availableQuests: QuestStoreState[];
    selectedQuest: string | null;       // name of selected quest
    assignedAventurers: AdventurerStoreState[];
}

type AllProps = Props & DispatchProps;

// tslint:disable-next-line:no-empty-interface
interface LocalState {
}

// todo: perhaps this can be a plain function
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
            const className = "quest" + ((q.name === this.props.selectedQuest) ? " selected" : "");
            return <li key={ q.name } className = { className } onClick = { () => { this.props.onQuestClick(q.name); } }>
                <div
                    className = "icon"
                    style={{backgroundImage: `url(${iconImgPath})`}}
                ></div>
                <div className = "title">{ TextManager.getQuestTitle(q.name) } </div>
            </li>;
        });

        const getQuestDetails = () => {
            if (!this.props.selectedQuest) {
                return null;
            }
            return <div className="quest-details">
                { TextManager.getQuestDescription(this.props.selectedQuest) }
                <AssignAdventurers
                    availableSlots = { 5 }
                    assignedAventurers = { this.props.assignedAventurers }
                    onRemoveAdventurer = { this.props.onRemoveAdventurer }
                    onAddEventurer = { this.props.onAddAdventurer } />
                { /** TODO:launch quest button */}
            </div>;
        };

        // quest board, expanded quest info + assign adventurers + launch button
        return <div className = "quest-board">
            <h2>Quest board</h2>
            <ul className = "quest-list">
                { questListContent }
            </ul>
            { getQuestDetails() }
        </div>;
    }
}
