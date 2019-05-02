import * as React from "react";
import { AppContextProps } from "src/components/App";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureLevelDefinition, TavernStructureDefinition } from "src/definitions/structures/types";
import { AdventurerStoreState } from "src/stores/adventurer";
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
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
/*    type: Structure;*/
}

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

// tslint:disable-next-line:no-empty-interface
interface LocalState {
}

export default class TavernStructureView extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
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
                const adventurer = this.props.adventurers.find((a) => a.room === i) || "" ;
                roomContent.push(<div key = { `room${i}` } className="room">
                    { `${adventurer && adventurer.name}` }
                </div>);
            }

            return <div className="rooms">
                { roomContent }
            </div>;
        };

        const createQuestArea = () => {
            // todo: left side = quest board, right side = expanded quest info + assign adventurers + launch button
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
}
