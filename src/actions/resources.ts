// tslint:disable:object-literal-sort-keys
import { Action } from "redux";
import { ResourceStoreState } from "stores/resources";

export enum ActionType {
    addResources = "addResources",
    removeResources = "removeResources",
}

export interface AddResources extends Action<ActionType> {
    resources: ResourceStoreState;
}

export function addResource(resource: string, value: number): AddResources {
    return addResources({
        [resource]: value,
    });
}

export function addResources(resources: ResourceStoreState): AddResources {
    return {
        type: ActionType.addResources,
        resources,
    };
}

export function removeResources(resources: ResourceStoreState): AddResources {
    return {
        type: ActionType.removeResources,
        resources,
    };
}
