import * as constants from '../constants';

export interface AddResource {
    type: constants.ADD_RESOURCE;
    resource: string,
    value: number
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