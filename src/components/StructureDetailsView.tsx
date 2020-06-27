
import ProductionStructureView from "containers/structures/ProductionStructureView";
import WarehouseStructureView from "containers/structures/warehouse/WarehouseStructureView";
import { getDefinition, Structure } from "definitions/structures";
import { StructureDefinition, StructureType } from "definitions/structures/types";
import * as React from "react";
import { StructureState } from "stores/structure";
import Progressbar from "./ui/Progressbar";
import ResourceStructureView from './structures/ResourceStructureView';
import TavernStructureView from './structures/tavern/TavernStructureView';
import "./css/structuredetailsview.css";
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { TasksStoreState } from 'stores/tasks';
import useStructure from 'hooks/store/useStructure';
import { withWindow } from 'hoc/withWindow';
import { Props as WindowProps } from "components/ui/window/Window";

export interface Props {
    structure: Structure;
}

const StructureDetailsView = (props: Props & WindowProps) => {
    const tasks = useSelector<StoreState, TasksStoreState>(store => store.tasks);
    const buildTask = tasks.running.filter((val) =>
        val.origin === `town` && val.name === `${props.structure}.build`)[0];
    const structureState = useStructure(props.structure);

    const renderContent = () => {
        if (structureState.state === StructureState.Building) {
            const progress = buildTask ? buildTask.progress : 1;
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

export default withWindow(StructureDetailsView);
