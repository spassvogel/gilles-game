import * as constants from '../constants';
import { Structure } from 'src/definitions/structures';
import { ResourceStoreState } from 'src/stores/resources';

export enum ActionType {
    addWorkers = "addWorkers",
    addResources = "addResources",
    removeResources = "removeResources"
}

export interface Action {
    type:ActionType
}

export interface AddResources {
    type:ActionType;
    resources:ResourceStoreState
}



export function addResource(resource:string, value:number): AddResources {
    return addResources({
        [resource]: value
    });
}

export function addResources(resources:ResourceStoreState): AddResources {
    return {
        type: ActionType.addResources,
        resources,
    }
}

export function removeResources(resources:ResourceStoreState): AddResources {
    return {
        type: ActionType.removeResources,
        resources,
    }
}

export interface ModifyWorkersAction extends Action {
    value:number
}

export function addWorkers(value:number): ModifyWorkersAction {
    return {
        type: ActionType.addWorkers,
        value
    }
}
export function subtractWorkers(value:number): ModifyWorkersAction {
    return {
        type: ActionType.addWorkers,
        value: -value
    }
}


// export function incrementCrossbows(): IncrementResource {
//     return {
//         type: constants.INCREMENT_RESOURCE,
//         resource: Weapons.CROSSBOWS
//     }
// }
// export function incrementLongbows(): IncrementResource {
//     return {
//         type: constants.INCREMENT_RESOURCE,
//         resource: Weapons.LONGBOWS
//     }
// }