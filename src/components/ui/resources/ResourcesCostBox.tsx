import { Resource } from "definitions/resources";
import resourceDescriptions from "definitions/resources";
import * as React from "react";
import { ResourceStoreState } from "store/types/resources";
import { TextManager } from "global/TextManager";
import { useMemo } from 'react';
import { useResourcesState } from 'hooks/store/resources';
import Icon from 'components/ui/common/Icon';
import "./styles/resourcesbox.scss";

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
const ResourcesCostBox = (props: AllProps) => {
    const {
        resources,
    } = props;

    const storeResources = useResourcesState();
    const sufficientResources = useMemo(() => {
        return Object.keys(resources).reduce((acc, value) => {
            acc[value] = storeResources[value] >= resources[value];
            return acc;
        }, {});
    }, [resources, storeResources]);


    const className = (props.className || "") + " resourcesbox";
    const listItems = Object.keys(props.resources).map((resource: string) => {
        let listItemClass = "resource";
        if (sufficientResources && !sufficientResources[resource]) {
             listItemClass += " insufficient";
        }
        const resourceDescription = resourceDescriptions[resource];
        if (!resourceDescription) {
            throw new Error(`No resource description found for ${resource}`);
        }

        return (
            <li
                className={listItemClass}
                key={resource}
            >
                <Icon
                    image={resourceDescription.iconImg}
                />
                <div className="name">
                    {TextManager.getResourceName(resource as Resource)}
                </div>
                <div className="amount" >
                    { props.resources[resource] }
                </div>
            </li>
        );
    });

    return (
        <ul className={className}>
            {listItems}
        </ul>
    );
};

export default ResourcesCostBox;
