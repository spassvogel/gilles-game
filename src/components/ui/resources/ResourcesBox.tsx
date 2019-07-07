import * as React from "react";
import { Resource } from "src/definitions/resources";
import { ResourceStoreState } from "src/stores/resources";
import { TextManager } from "src/utils/textManager";
import "./css/resourcesbox.css";

export interface Props {
    className?: string;
    resources: ResourceStoreState;
}

export interface StateProps {
    sufficientResources?: Record<Resource, boolean>;
}

type AllProps = Props & StateProps;

/**
 * The ResourcesBox displays a list of resources
 */
const ResourcesBox = (props: AllProps) => {
    const {
        sufficientResources,
    } = props;
    const className = (props.className || "") + " resourcesbox";
    const listItems = Object.keys(props.resources).map((resource: Resource) => {
        let listItemClass = "resource";
        if (sufficientResources && !sufficientResources[resource]) {
             listItemClass += " insufficient";
        }
        return <li className = { listItemClass } key = { resource }>
            <div className = "icon"></div>
            <div className = "name">
                { TextManager.getResourceName(resource) }
            </div>
            <div className = "amount" >
                { props.resources[resource] }
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
