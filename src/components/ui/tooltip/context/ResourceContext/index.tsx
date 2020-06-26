import * as React from "react";
import { TextManager } from 'global/TextManager';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { StructuresStoreState } from 'stores/structures';
import { Resource } from 'definitions/resources';
import { getStructureByResource } from 'definitions/structures';
import { StructureState } from 'stores/structure';
import { getStructureLink } from 'utils/routing';
import { Link } from 'react-router-dom';
import './resourceContext.css';

export interface Props {
    info: string;
}

const ResourceContext = (props: Props) => {

    const resource = props.info;
    const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures);

    switch (resource) {
        case Resource.fabric:
        case Resource.food:
        case Resource.iron:
        case Resource.leather:
        case Resource.stone:
        case Resource.wood: {
            const structure = getStructureByResource(Resource[resource]);
            return (
                <>
                    <div className="resource-context">
                        {TextManager.get(`resource-${resource}-info`)}
                    </div>
                    <div>
                        Produced by:
                        { structures[structure].state === StructureState.Built ? (
                            <Link to={getStructureLink(structure)} >
                                { ` ${TextManager.getStructureName(structure)}` }
                            </Link>
                        ) : (
                            TextManager.getStructureName(structure)
                        )}
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