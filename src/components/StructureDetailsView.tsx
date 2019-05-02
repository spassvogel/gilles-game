
import * as React from "react";
import ProductionStructureView from "src/containers/structures/ProductionStructureView";
import ResourceStructureView from "src/containers/structures/ResourceStructureView";
import TavernStructureView from "src/containers/structures/tavern/TavernStructureView";
import WarehouseStructureView from "src/containers/structures/warehouse/WarehouseStructureView";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureDefinition, StructureType } from "src/definitions/structures/types";
import { StructureState, StructureStoreState } from "src/stores/structure";
import { StructuresStoreState } from "src/stores/structures";
import { TaskStoreState } from "src/stores/task";
import "./css/structuredetails.css";
import Progressbar from "./ui/Progressbar";

export interface Props {
    structure: Structure;
}

export interface StateProps  {
    structures: StructuresStoreState;
    buildTask: TaskStoreState;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

type AllProps = Props & StateProps & DispatchProps;

const getStructureView = (structure: Structure) => {
    const structureDefinition: StructureDefinition = structureDefinitions[structure];
    switch (structureDefinition.type) {
        case StructureType.production: {
            return <ProductionStructureView type = { structure }/>;
        }
        case StructureType.resource: {
            return <ResourceStructureView type = { structure }/>;
        }
        case StructureType.warehouse: {
            return <WarehouseStructureView type = { structure }/>;
        }
        case StructureType.tavern: {
            return <TavernStructureView />;
        }
        default: {
            return <div> { structure } </div>;
        }
    }
};

export default function(props: AllProps) {
    let view;
    const structureState: StructureStoreState = props.structures[props.structure];
    if (structureState.state === StructureState.Building) {
        const progress = props.buildTask ? props.buildTask.progress : 1 ;
        view = <div>
            <Progressbar label = "Building..." progress= { progress } />
        </div>;
    } else {
        view = getStructureView(props.structure) ;
    }

    return <fieldset className="structure-details">
        <legend>Structure</legend>
        { view }
    </fieldset>;
}
