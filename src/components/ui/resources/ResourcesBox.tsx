import * as React from "react";
import { Resource } from "src/definitions/resources";
import { ResourceStoreState } from "src/stores/resources";
import { TextManager } from "src/utils/textManager";
import "./css/resourcesbox.css";

export interface Props {
    className?: string;
    resources: ResourceStoreState;
}

/**
 * The ResourcesBox displays a list of resources
 */
const ResourcesBox = (props: Props) => {
    const className = (props.className || "") + " resourcesbox";
    const listItems = Object.keys(props.resources).map((resource: Resource) => {
        return <li className = "resource" key = { resource }>
            <div className = "icon"></div>
            <div className = "name">
                { TextManager.getResourceName(resource) }
            </div>
            <div className = "amount">
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
