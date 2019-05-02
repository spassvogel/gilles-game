import * as React from "react";
import { AppContextProps } from "src/components/App";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureLevelDefinition, TavernStructureDefinition } from "src/definitions/structures/types";
import { TextManager } from "src/utils/textManager";
import "./css/tavernstructureview.css";

// The UI for the tavern
export interface DispatchProps {
//    onUpgrade?: (cost: number) => void;
//   onCraft?: (productionDefinition: ProductionDefinition, workers: number) => void;
}

export interface StateProps {
    level: number; /*
    resources: ResourceStoreState;
    workersFree: number;
    gold: number;
    tasks: TaskStoreState[];*/
}

export interface Props {
/*    type: Structure;*/
}

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

// tslint:disable-next-line:no-empty-interface
interface LocalState {
}

export default class ProductionStructureView extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
        };
    }

    public componentDidUpdate(prevProps: AllProps, prevState: LocalState) {
        // console.log("cdu" + prevProps.workersFree);
    }

    public componentWillUnmount() {
        // console.log("component will unmount");
    }

    public render() {
        const structureDefinition  = structureDefinitions[Structure.tavern] as TavernStructureDefinition;
        const level: number = this.props.level || 0;
        const levelDefinition: StructureLevelDefinition = structureDefinition.levels[level];
        const displayName = TextManager.get(levelDefinition.displayName);

        return (
            <details open = { true } className = "tavernstructureview">
                <summary>{displayName}</summary>
                <section>
                </section>
            </details>
        );
    }
}
