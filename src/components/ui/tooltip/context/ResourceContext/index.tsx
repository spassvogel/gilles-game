import * as React from "react";
import { TextManager } from 'global/TextManager';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { StructuresStoreState } from 'stores/structures';
import { Resource } from 'definitions/resources';
import { getStructureByResource, getDefinition } from 'definitions/structures';
import { StructureState } from 'stores/structure';
import { getStructureLink } from 'utils/routing';
import { Link } from 'react-router-dom';
import { ResourceStructureLevelDefinition, ResourceStructureDefinition } from 'definitions/structures/types';
import './resourceContext.scss';

export interface Props {
    info: string;
}

const ResourceContext = (props: Props) => {

    const resource = props.info;
    const structureStates = useSelector<StoreState, StructuresStoreState>(store => store.structures);

    const renderProducedBy = () => {
        const structure = getStructureByResource(Resource[resource]);
        const structureState = structureStates[structure];
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
            return (
                <>
                    <div className="resource-context">
                        {TextManager.get(`resource-${resource}-info`)}
                    </div>
                    <div>
                        {renderProducedBy()}
                    </div>
                </>
            )
        }
        default: {
            return (
                <>
                    <div className="resource-context">
                        {` ${TextManager.get(`resource-${resource}-info`)}`}
                    </div>
                </>
            )
        }

    }

}
export default ResourceContext;