import * as React from "react";
import { AppContextProps } from "src/components/App";
import DraggableAdventurerAvatar, { AdventurerAvatarDragInfo } from "src/components/ui/DraggableAdventurerAvatar";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureLevelDefinition, TavernStructureDefinition } from "src/definitions/structures/types";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStatus, QuestStoreState } from "src/stores/quest";
import { TextManager } from "src/utils/textManager";
import "./css/tavernstructureview.css";
import QuestBoard from "./QuestBoard";

// The UI for the tavern
export interface DispatchProps {
    onLaunchQuest: (questName: string, assignedAventurers: AdventurerStoreState[]) => void;
}

export interface StateProps {
    level: number;
    adventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
/*    type: Structure;*/
}

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

// tslint:disable-next-line:no-empty-interface
interface LocalState {
    selectedQuestName: string | null;
    assignedAventurers: AdventurerStoreState[];
}

const SOURCE_ID = "tavern";

export default class TavernStructureView extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            assignedAventurers: [],
            selectedQuestName: null,
        };
    }

    public render() {
        const structureDefinition  = structureDefinitions[Structure.tavern] as TavernStructureDefinition;
        const level: number = this.props.level || 0;
        const levelDefinition: StructureLevelDefinition = structureDefinition.levels[level];
        const displayName = TextManager.get(levelDefinition.displayName);

        // todo: figure out how amount of rooms is determined. perhaps by level?
        const roomCount = 20;

        const createRooms = () => {

            const roomContent: JSX.Element[] = [];
            for (let i = 0; i < roomCount; i++) {
                const adventurer = this.props.adventurers.find((a) => a.room === i);
                let content = null;
                if (adventurer) {
                    let name = adventurer.name;

                    const assigned = this.state.assignedAventurers.indexOf(adventurer) > -1; // assigned to a quest in the QuestBoard
                    const party = this.getQuestByAdventurer(adventurer.id);
                    if (party) {
                        name += " (on a quest)";
                    }
                    content = [<DraggableAdventurerAvatar
                        disabled = { assigned || party != null }
                        adventurer = { adventurer }
                        className = "adventurer-icon"
                        sourceId = { SOURCE_ID }
                        key = { `avatar:${adventurer.id}` }
                    />,
                    name,
                    <button
                        className = "boot"
                        key = { `boot:${adventurer.id}` }
                    >
                        Boot
                    </button>,
                ];
                } else {
                    content = "(empty room)";
                }

                roomContent.push(<div key = { `room${i}` } className = "room">
                    { content }
                </div>);
            }

            return <div className = "rooms">
                <h2>Rooms</h2>
                { roomContent }
            </div>;
        };

        const availableQuests = this.props.quests.filter((q) => q.status === QuestStatus.available );

        return (
            <details open = { true } className = "tavernstructureview">
                <summary>{ displayName }</summary>
                <section>
                    { createRooms() }
                    <QuestBoard
                        availableQuests = { availableQuests }
                        selectedQuestName = { this.state.selectedQuestName }
                        assignedAventurers = { this.state.assignedAventurers }
                        onQuestClick = { (name: string) => this.handleQuestClick(name) }
                        onAddAdventurer = { (item: AdventurerAvatarDragInfo, index: number) => this.handleAddAdventurer(item, index) }
                        onRemoveAdventurer = { (index: number) => this.handleRemoveAdventurer(index) }
                        onLaunchQuest = { () => this.handleLaunchQuest() } 
                    />
                </section>
            </details>
        );
    }

    private handleQuestClick(name: string) {
        if (this.state.selectedQuestName === name) {
            this.setState( { selectedQuestName: null });
        } else {
            this.setState( { selectedQuestName: name });
        }

        // Unassign all adventurers
        this.setState({
            assignedAventurers: [],
        });
    }

    private handleAddAdventurer(item: AdventurerAvatarDragInfo, index: number) {
        if (item.sourceId === SOURCE_ID) {
            const assignedAventurers = [ ...this.state.assignedAventurers];
            assignedAventurers[index] = item.adventurer;
            this.setState({
                assignedAventurers,
            });
        }
    }

    /**
     * Removes an assigned adventurer from a slot
     * @param index
     */
    private handleRemoveAdventurer(index: number): void {
        const assignedAventurers = [ ...this.state.assignedAventurers];
        delete assignedAventurers[index];
        this.setState({
            assignedAventurers,
        });
    }

    private handleLaunchQuest(): void {
        const assignedAventurers = this.state.assignedAventurers;
        const selectedQuestName = this.state.selectedQuestName!;
        this.props.onLaunchQuest(selectedQuestName, assignedAventurers);
    }

    /**
     * Returns the party the adventurer is in. undefined if not in any party
     * @param adventurerId
     */
    private getQuestByAdventurer(adventurerId: string): QuestStoreState | undefined {
        return Object.values(this.props.quests).find((quest) => {
            return quest.party.indexOf(adventurerId) > -1;
        });
    }
}
