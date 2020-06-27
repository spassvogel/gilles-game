
import ProductionStructureView from "containers/structures/ProductionStructureView";
import WarehouseStructureView from "containers/structures/warehouse/WarehouseStructureView";
import { getDefinition, Structure } from "definitions/structures";
import { StructureDefinition, StructureType } from "definitions/structures/types";
import * as React from "react";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { TaskStoreState } from "stores/task";
import Progressbar from "./ui/Progressbar";
import ResourceStructureView from './structures/ResourceStructureView';
import TavernStructureView from './structures/tavern/TavernStructureView';
import "./css/structuredetails.css";

export interface Props {
    structure: Structure;
}

export interface StateProps  {
    structures: StructuresStoreState;
    buildTask: TaskStoreState;
}

// tslint:disable-next-line:no-empty-interface

type AllProps = Props & StateProps;


const StructureDetails = (props: AllProps) => {

    const renderContent = () => {
        const structureState: StructureStoreState = props.structures[props.structure];
        if (structureState.state === StructureState.Building) {
            const progress = props.buildTask ? props.buildTask.progress : 1;
            return (
                <div>
                    <Progressbar label="Building..." progress={progress} />
                </div>
            );
        } else {

            const structureDefinition: StructureDefinition = getDefinition(props.structure);
            switch (structureDefinition.type) {
                case StructureType.production: {
                    return <ProductionStructureView type = { props.structure }/>;
                }
                case StructureType.resource: {
                    return <ResourceStructureView type = { props.structure }/>;
                }
                case StructureType.warehouse: {
                    return <WarehouseStructureView />;
                }
                case StructureType.tavern: {
                    return <TavernStructureView />;
                }
                default: {
                    return <div> { props.structure } </div>;
                }
            }
        }
    }

    return (
        <div className="structure-details">
            { renderContent() }
        </div>
    );
};

export default StructureDetails;
