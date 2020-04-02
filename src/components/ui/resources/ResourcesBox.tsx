import "components/ui/css/common/icon.css";
import "components/ui/resources/css/resourcesbox.css";
import { Resource } from "definitions/resources";
import resourceDescriptions from "definitions/resources";
import * as React from "react";
import { ResourceStoreState } from "stores/resources";
import { TextManager } from "utils/textManager";
import { StructuresStoreState } from 'stores/structures';
import { Structure } from 'definitions/structures';

export interface Props {
    className?: string;
    resources: ResourceStoreState;
    structures: StructuresStoreState;
    maxResources: ResourceStoreState;
    deltaResources: ResourceStoreState;
}

export interface StateProps {
    sufficientResources?: Record<Resource, boolean>;
}

type AllProps = Props & StateProps;

/**
 * The ResourcesBox is used in the Warehouse to show a list of resources
 */
const ResourcesBox = (props: AllProps) => {
    const {
        sufficientResources,
        resources,
        deltaResources,
    } = props;

    const className = (props.className || "") + " resourcesbox";
    const listItems = Object.keys(resources).map((resource: string) => {
        let listItemClass = "resource";
        if (sufficientResources && !sufficientResources[resource]) {
             listItemClass += " insufficient";
        }
        const resourceDescription = resourceDescriptions[resource];
        const amount = props.resources[resource]!;
        if (!resourceDescription) {
            throw new Error(`No resource description found for ${resource}`);
        }

        let delta;
        if (deltaResources[resource]) {
            delta = <span className = "animate-up">
                { `+ ${deltaResources[resource]!.toFixed(2)}`  }
            </span>;
        }

        const structure = getStructure(resource);

        return <li className = { listItemClass } key = { resource }>
            <div className = "icon common-icon-smallest" style = {{
                backgroundImage:  `url(${process.env.PUBLIC_URL}${resourceDescription.iconImg})`,
            }}></div>
            <div className = "name">
                { TextManager.getResourceName(resource as Resource) }
            </div>
            <div className = "amount" >
                { amount.toFixed(1) }
            </div>
            <div className = "max" >
                { ` / ${props.maxResources[resource]}` }
            </div>
            <div className = "delta">
                { delta }
            </div>
            <div className = "structure"> 
                gen. by { structure }
            </div>
        </li>;
    });

    return (
        <ul className = { className } >
            { listItems }
        </ul>
    );
};

export default ResourcesBox;

const getStructure = (resource: string) : Structure => {
    switch (resource) {
        case Resource.fabric:
            return Structure.weaver;
        case Resource.food:
            return Structure.garden;
        case Resource.iron:
            return Structure.mine;
        case Resource.leather:
            return Structure.tannery;
        case Resource.stone:
            return Structure.quarry;
        case Resource.wood:
            return Structure.lumberMill;
    }
    throw new Error(`Unknown structure for resource ${resource}`);
}
