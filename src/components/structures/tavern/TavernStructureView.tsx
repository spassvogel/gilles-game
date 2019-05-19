import * as React from "react";
import { AppContextProps } from "src/components/App";
import DraggableAdventurerAvatar from "src/components/ui/DraggableAdventurerAvatar";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureLevelDefinition, TavernStructureDefinition } from "src/definitions/structures/types";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";
import { TextManager } from "src/utils/textManager";
import "./css/tavernstructureview.css";

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
}

export default class TavernStructureView extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
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
                    content = [<DraggableAdventurerAvatar
                        adventurer = { adventurer }
                        className = "adventurer-icon"
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

        const createQuestArea = () => {
            const questListContent: JSX.Element[] = this.props.availableQuests.map((q) => {
                const iconImgPath = `img/sigils/${ q.icon }`;
                const className = "quest" + ((q.name === this.state.selectedQuest) ? " selected" : "");
                return <li key={ q.name } className = { className } onClick = { () => { this.handleQuestClick(q.name); } }>
                    <div
                        className = "icon"
                        style={{backgroundImage: `url(${iconImgPath})`}}
                    ></div>
                    <div className = "title">{ TextManager.getQuestTitle(q.name) } </div>
                </li>;
            });

            // quest board, expanded quest info + assign adventurers + launch button
            return <div className = "quest-area">
                <h2>Quest board</h2>
                <ul className = "quest-board">
                    { questListContent }
                </ul>
            </div>;
        };

        return (
            <details open = { true } className = "tavernstructureview">
                <summary>{displayName}</summary>
                <section>
                    { createRooms() }
                    { createQuestArea() }
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
}
