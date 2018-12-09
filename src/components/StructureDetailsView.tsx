
import * as React from "react";
import ProductionStructureView from "src/containers/ProductionStructureView";
import ResourceStructureView from "src/containers/ResourceStructureView";
import WarehouseStructureView from "src/containers/WarehouseStructureView";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StructureDefinition, StructureType } from "src/definitions/structures/types";
import "./css/structuredetails.css";

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {}

export interface Props extends DispatchProps {
    structure: Structure;
}

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

export default function(props: Props) {
    return <fieldset className="structure-details">
        <legend>Selected structure</legend>
        { getStructureView(props.structure) }
    </fieldset>;
}
