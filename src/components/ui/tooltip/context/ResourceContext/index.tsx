import * as React from "react";
import { TextManager } from 'global/TextManager';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { StructuresStoreState } from 'stores/structures';
import { Resource } from 'definitions/resources';
import { getStructureByResource, getDefinition } from 'definitions/structures';
import { StructureState, StructureStoreState } from 'stores/structure';
import { getStructureLink } from 'utils/routing';
import { Link } from 'react-router-dom';
import { ResourceStructureLevelDefinition, ResourceStructureDefinition } from 'definitions/structures/types';
import useResourcesState from 'hooks/store/useResourcesState';
import { formatNumber } from 'utils/format/number';
import useGoldState from 'hooks/store/useGoldState';
import { useWorkersFreeState, useWorkersState } from 'hooks/store/useWorkersState';
import './resourceContext.scss';

export interface Props {
    info: string;
}

const ResourceContext = (props: Props) => {

    const resource = props.info;
    const resourcesState = useResourcesState();
    const goldState = useGoldState();
    const workersState = useWorkersState();
    const workersFreeState = useWorkersFreeState();
    const structureStates = useSelector<StoreState, StructuresStoreState>(store => store.structures);

    const renderProducedBy = () => {
        const structure = getStructureByResource(Resource[resource]);
        const structureState: StructureStoreState = structureStates[structure];
        if (structureState.state !== StructureState.Built) {
            return (
                <span>
                    {TextManager.get("ui-tooltip-resource-produce-row-notbuilt", {
                        structure: TextManager.getStructureName(structure)
                    })}
                </span>
            )
        }
        const structureDefinition = getDefinition<ResourceStructureDefinition>(structure);
        const levelDefinition: ResourceStructureLevelDefinition = structureDefinition.levels[structureState.level];
        const amount = levelDefinition.generates[resource];
        // Split the string at {{structure}}
        const split = TextManager.get("ui-tooltip-resource-produce-row", {
            structure: "%SPLIT%",
            amount
        }).split("%SPLIT%");
        return (
            <span className="produced">
                {split[0]}
                <Link to={getStructureLink(structure)} >
                    { TextManager.getStructureName(structure) }
                </Link>
                {split[1]}
            </span>
        )
    }

    switch (resource) {
        case Resource.fabric:
        case Resource.food:
        case Resource.iron:
        case Resource.leather:
        case Resource.stone:
        case Resource.wood: {
            const amount = formatNumber(resourcesState[resource]!, 0);

            return (
                <>
                    <div className="resource-context">
                        {TextManager.get(`resource-${resource}-info`)}
                    </div>
                    <div>
                        {TextManager.get(`ui-tooltip-resource-quantity`, { amount } )}
                    </div>
                    <div>
                        {renderProducedBy()}
                    </div>
                </>
            )
        }
        case "gold": {
            const amount = goldState;
            return (
                <>
                    <div className="resource-context">
                        {` ${TextManager.get(`resource-${resource}-info`)}`}
                    </div>
                    <div>
                        {TextManager.get(`ui-tooltip-resource-quantity`, { amount } )}
                    </div>
                </>
            )
        }
        case "workers": {
            const free = workersFreeState;
            const total = workersState;
            return (
                <>
                    <div className="resource-context">
                        {` ${TextManager.get(`resource-${resource}-info`)}`}
                    </div>
                    <div>
                        {TextManager.get(`ui-tooltip-workers-quantity`, { free, total } )}
                    </div>
                </>
            )
        }
        default:
            throw new Error("Uknow value " + resource);
    }

}
export default ResourceContext;