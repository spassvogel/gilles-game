
import * as React from "react";
import ProductionStructureView from "src/containers/ProductionStructureView";
import ResourceStructureView from "src/containers/ResourceStructureView";
import WarehouseStructureView from "src/containers/WarehouseStructureView";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureDefinition, StructureType } from "src/definitions/structures/types";
import { StructuresStoreState } from "src/stores/structures";
import "./css/structuredetails.css";
// tslint:disable-next-line:ordered-imports
import { StructureStoreState, StructureState } from "src/stores/structure";
import Progressbar from "./ui/Progressbar";

export interface Props {
    structure: Structure;
}

export interface StateProps  {
    structures: StructuresStoreState;
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
        default: {
            return <div> { structure } </div>;
        }
    }
};

export default function(props: AllProps) {
    let view;
    const structureState: StructureStoreState = props.structures[props.structure];
    if (structureState.state === StructureState.Building) {
        // todo: update progress
        view = <div>
            <Progressbar label = "Building..."/>
        </div>;
    } else {
        view = getStructureView(props.structure) ;
    }

    return <fieldset className="structure-details">
        <legend>Structure</legend>
        { view }
    </fieldset>;
}
