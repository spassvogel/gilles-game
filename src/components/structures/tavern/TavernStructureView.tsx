import * as React from "react";
import { AppContextProps } from "src/components/App";
import DraggableAdventurerAvatar, { AdventurerAvatarDragInfo } from "src/components/ui/DraggableAdventurerAvatar";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureLevelDefinition, TavernStructureDefinition } from "src/definitions/structures/types";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";
import { TextManager } from "src/utils/textManager";
import "./css/tavernstructureview.css";
import QuestBoard from "./QuestBoard";

// The UI for the tavern
// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
//    onUpgrade?: (cost: number) => void;
//   onCraft?: (productionDefinition: ProductionDefinition, workers: number) => void;
}

export interface StateProps {
    level: number;
    adventurers: AdventurerStoreState[];
    availableQuests: QuestStoreState[];
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
/*    type: Structure;*/
}

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

// tslint:disable-next-line:no-empty-interface
interface LocalState {
    selectedQuest: string | null;
    assignedAventurers: AdventurerStoreState[];
}

const SOURCE_ID = "tavern";

export default class TavernStructureView extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            assignedAventurers: [],
            selectedQuest: null,
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
                    const assigned = this.state.assignedAventurers.indexOf(adventurer) > -1;
                    content = [<DraggableAdventurerAvatar
                        disabled = { assigned }
                        adventurer = { adventurer }
                        className = "adventurer-icon"
                        sourceId = { SOURCE_ID }
                        key = { `avatar:${adventurer.id}` }
                    />,
                    adventurer.name,
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

        return (
            <details open = { true } className = "tavernstructureview">
                <summary>{ displayName }</summary>
                <section>
                    { createRooms() }
                    <QuestBoard
                        availableQuests = { this.props.availableQuests }
                        selectedQuest = { this.state.selectedQuest }
                        assignedAventurers = { this.state.assignedAventurers }
                        onQuestClick = { (name: string) => this.handleQuestClick(name) }
                        onDropAdventurer = { (item: AdventurerAvatarDragInfo, index: number) => this.handleAdventurerDrop(item, index) }
                        onRemoveAdventurer = { (index: number) => this.handleRemoveAdventurer(index) }
                    />
                </section>
            </details>
        );
    }

    private handleQuestClick(name: string) {
        if (this.state.selectedQuest === name) {
            this.setState( { selectedQuest: null });
        } else {
            this.setState( { selectedQuest: name });
        }
    }

    private handleAdventurerDrop(item: AdventurerAvatarDragInfo, index: number) {
        if (item.sourceId === SOURCE_ID) {
            const assignedAventurers = [ ...this.state.assignedAventurers];
            assignedAventurers[index] = item.adventurer;
            this.setState({
                assignedAventurers,
            });
        }
    }

    /*
     * Removes an assigned adventurer from a slot
     * @param index  */
    private handleRemoveAdventurer(index: number): void {
        const assignedAventurers = [ ...this.state.assignedAventurers];
        delete assignedAventurers[index];
        this.setState({
            assignedAventurers,
        });
    }
}
