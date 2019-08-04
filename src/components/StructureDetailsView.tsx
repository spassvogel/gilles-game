
import ProductionStructureView from "containers/structures/ProductionStructureView";
import ResourceStructureView from "containers/structures/ResourceStructureView";
import TavernStructureView from "containers/structures/tavern/TavernStructureView";
import WarehouseStructureView from "containers/structures/warehouse/WarehouseStructureView";
import structureDefinitions, { Structure, getDefinition } from "definitions/structures";
import { StructureDefinition, StructureType } from "definitions/structures/types";
import * as React from "react";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { TaskStoreState } from "stores/task";
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
    const structureDefinition: StructureDefinition = getDefinition(structure);
    switch (structureDefinition.type) {
        case StructureType.production: {
            return <ProductionStructureView type = { structure }/>;
        }
        case StructureType.resource: {
            return <ResourceStructureView type = { structure }/>;
        }
        case StructureType.warehouse: {
            return <WarehouseStructureView />;
        }
        case StructureType.tavern: {
            return <TavernStructureView />;
        }
        default: {
            return <div> { structure } </div>;
        }
    }
};

const StructureDetails = (props: AllProps) => {
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
};

export default StructureDetails;
