import * as React from "react";
import "src/components/ui/css/common/icon.css";
import { Resource } from "src/definitions/resources";
import resourceDescriptions from "src/definitions/resources";
import { ResourceStoreState } from "src/stores/resources";
import { TextManager } from "src/utils/textManager";
import "./css/resourcesbox.css";

export interface Props {
    className?: string;
    resources: ResourceStoreState;
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
    const listItems = Object.keys(resources).map((resource: Resource) => {
        let listItemClass = "resource";
        if (sufficientResources && !sufficientResources[resource]) {
             listItemClass += " insufficient";
        }
        const resourceDescription = resourceDescriptions[resource];
        const amount = props.resources[resource]!;

        let delta;
        if (deltaResources[resource]) {
            delta = <span className = "animate-up">
                { `+ ${deltaResources[resource]!.toFixed(2)}`  }
            </span>;
        }
        return <li className = { listItemClass } key = { resource }>
            <div className = "icon common-icon-smallest" style = {{
                backgroundImage:  `url(${resourceDescription.iconImg})`,
            }}></div>
            <div className = "name">
                { TextManager.getResourceName(resource) }
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
        </li>;
    });

    return (
        <ul className = { className } >
            { listItems }
        </ul>
    );
};

export default ResourcesBox;
