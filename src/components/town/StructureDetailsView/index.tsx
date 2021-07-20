import * as React from "react";
import { getDefinition, Structure } from "definitions/structures";
import { StructureDefinition, StructureType } from "definitions/structures/types";
import { StructureState } from "store/types/structure";
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { TasksStoreState } from 'store/types/tasks';
import { useStructureState } from 'hooks/store/structures';
import { withWindow } from 'hoc/withWindow';
import { Props as WindowProps } from "components/ui/window/Window";
import { formatDuration } from 'utils/format/time';
import { TickingProgressbar } from 'components/ui/common/progress';
import ProductionStructureView from 'components/structures/production/ProductionStructureView';
import WarehouseStructureView from 'components/structures/warehouse/WarehouseStructureView';
import TavernStructureView from 'components/structures/tavern/TavernStructureView';
import ResourceStructureView from 'components/structures/resource/ResourceStructureView';
import { Link, useParams } from "react-router-dom";
import { TextManager } from "global/TextManager";
import Button from "components/ui/buttons/Button";
import { getStructureLink } from "utils/routing";
import "./styles/structuredetailsview.scss";

export interface Props {
    structure: Structure;
}

const StructureDetailsView = (props: Props & WindowProps) => {
    const tasks = useSelector<StoreState, TasksStoreState>(store => store.tasks);
    const buildTask = tasks.running.filter((val) =>
        val.origin === `town` && val.name === `${props.structure}.build`)[0];
    const structureState = useStructureState(props.structure);

    const renderContent = () => {
        if (structureState.state === StructureState.Building) {
            if (!buildTask) return null;
            return (
                <div className="building">
                    <TickingProgressbar
                        progress={buildTask.progress}
                        label={`Building... (${formatDuration(buildTask.timeRemaining)})`}
                    />
                </div>
            );
        } else {

            const structureDefinition: StructureDefinition = getDefinition(props.structure);
            switch (structureDefinition.type) {
                case StructureType.production: {
                    return <ProductionStructureView structure={props.structure}/>;
                }
                case StructureType.resource: {
                    return <ResourceStructureView structure={props.structure} />;
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

export default StructureDetailsView
export const StructureDetailsWindow = withWindow(StructureDetailsView);

export const RoutedStructureDetailsView = () => {
    const { structure } = useParams<{structure: Structure}>();
    const title = TextManager.getStructureName(structure)
    return (
        <div className="structure-details-window ">
            <div className="header">
                <h3>{ title }</h3>
                <Link to={getStructureLink(structure, true)}>
                    <Button
                        className="close-button"
                        square={true}
                        size={"medium"}
                        color="purple"
                        text="x"
                    />
                </Link>
            </div>
            <StructureDetailsView structure={structure} title={title}  />
        </div>
    )
}