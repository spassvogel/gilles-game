import * as constants from '../constants';
import { Weapons } from '../stores'; // todo: refactor

export interface IncrementResource {
    type: constants.INCREMENT_RESOURCE;
    resource: string
}

export interface SetStructureAmount {
    type: constants.SET_STRUCTURE_AMOUNT;
    structure: string,
    amount: number
}

//export type IncrementSomething = IncrementStructure | IncrementResource; // UNUSED?
export type StructureAction = SetStructureAmount; // UNUSED?

export function setStructureAmount(structure:string, amount:number): SetStructureAmount {
    return {
        type: constants.SET_STRUCTURE_AMOUNT,
        structure,
        amount
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