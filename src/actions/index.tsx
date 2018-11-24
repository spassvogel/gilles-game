import * as constants from '../constants';
import { StructureType } from 'src/definitions/structures';

export enum ActionType {
    addGold = "addGold",
    addWorkers = "addWorkers"
}

export interface Action {
    type:ActionType
}

export interface AddResource {
    type: constants.ADD_RESOURCE;
    resource: string,
    value: number
}



export function addResource(resource:string, value:number): AddResource {
    return {
        type: constants.ADD_RESOURCE,
        resource,
        value
    }
}

export interface ModifyGoldAction extends Action {
    value:number
}
export interface ModifyWorkersAction extends Action {
    value:number
}

export function addGold(value:number): ModifyGoldAction {
    return {
        type: ActionType.addGold,
        value
    }
}
export function subtractGold(value:number): ModifyGoldAction {
    return {
        type: ActionType.addGold,
        value: -value
    }
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