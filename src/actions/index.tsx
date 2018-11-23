import * as constants from '../constants';
import { StructureType } from 'src/definitions/structures';

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