import * as React from "react";
import { AppContextProps } from "components/App";
import DraggableAdventurerAvatar, { AdventurerAvatarDragInfo } from "components/ui/DraggableAdventurerAvatar";
import structureDefinitions, { Structure } from "definitions/structures";
import { TavernStructureDefinition, TavernStructureLevelDefinition } from "definitions/structures/types";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { TextManager } from "utils/textManager";
import "./css/tavernstructureview.css";
import QuestBoard from "./QuestBoard";

// The UI for the tavern
export interface DispatchProps {
    onLaunchQuest: (questName: string, assignedAventurers: AdventurerStoreState[]) => void;
    onUpgrade?: (cost: number, level: number) => void;
}

export interface StateProps {
    gold: number;
    level: number;
    adventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
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
        const levelDefinition: TavernStructureLevelDefinition = structureDefinition.levels[level];
        const displayName = TextManager.get(levelDefinition.displayName);

        const createUpgradeRow = () => {
            const gold = this.props.gold;
            const nextLevel = structureDefinition.levels[level + 1];
            const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
            const canUpgrade = nextLevel != null && gold >= nextLevelCost;
            const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

            const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
                if (this.props.onUpgrade) { this.props.onUpgrade(nextLevelCost, level + 1); }
            };
            return <div>
                <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
                <button
                    style = {{ float: "right" }}
                    onClick = { handleClick }
                    disabled= { !canUpgrade }
                >
                    { upgradeText }
                </button>
            </div>;
        };

        const roomCount = levelDefinition.rooms;
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
                    /*
                    <button
                        className = "boot"
                        key = { `boot:${adventurer.id}` }
                    >
                        Boot
                    </button>,*/
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
                {
                    createUpgradeRow()
                }
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
