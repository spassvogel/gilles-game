import * as constants from '../constants';
import { Structure } from 'src/definitions/structures';

export enum ActionType {
    addWorkers = "addWorkers",
    addResource = "addResource"
}

export interface Action {
    type:ActionType
}

export interface AddResource {
    type: ActionType;
    resource: string,
    value: number
}



export function addResource(resource:string, value:number): AddResource {
    return {
        type: ActionType.addResource,
        resource,
        value
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