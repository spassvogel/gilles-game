import * as React from "react";
import { TextManager } from 'global/TextManager';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { StructuresStoreState } from 'store/types/structures';
import { Resource } from 'definitions/resources';
import { getStructureByResource, getDefinition } from 'definitions/structures';
import { StructureState, StructureStoreState } from 'store/types/structure';
import { ResourceStructureLevelDefinition, ResourceStructureDefinition } from 'definitions/structures/types';
import { useMaxResourcesState, useResourcesState } from 'hooks/store/resources';
import { formatNumber } from 'utils/format/number';
import useGoldState from 'hooks/store/useGoldState';
import { useWorkersFreeState, useWorkersState } from 'hooks/store/useWorkersState';
import './resourceContext.scss';
import ReactMarkdown from "react-markdown";

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
    const maxResources = useMaxResourcesState();

    const renderProducedBy = () => {
        const structure = getStructureByResource(resource as Resource);
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
        const amount = levelDefinition.generates[resource as Resource];

        return (
            <span className="produced">
                <ReactMarkdown>
                    {TextManager.get("ui-tooltip-resource-produce-row", {
                        structure,
                        amount
                    })}
                </ReactMarkdown>
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
            const amount = formatNumber(resourcesState[resource] ?? 0, 0);
            const full = (resourcesState[resource] ?? 0) >= (maxResources?.[resource] ?? 0);
            return (
                <div className="resource-context">
                    <div className="info">
                        {TextManager.get(`resource-${resource}-info`)}
                    </div>
                    <div>
                        {TextManager.get(`ui-tooltip-resource-quantity`, { amount } )}
                    </div>
                    <div>
                        {renderProducedBy()}
                    </div>
                    { full && (
                        <div className="warning-full">
                            {TextManager.get(`ui-tooltip-resource-warehouse-full`, { resource })}
                        </div>
                    )}
                </div>
            )
        }
        case "gold": {
            const amount = goldState;
            return (
                <>
                    <div className="resource-context">
                        <div className="info">
                            {` ${TextManager.get(`resource-${resource}-info`)}`}
                        </div>
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
                       <div className="info">
                        {` ${TextManager.get(`resource-${resource}-info`)}`}
                        </div>
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