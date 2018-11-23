import { StructureType } from 'src/definitions/structures';

export enum ActionType {
    upgradeStructure = "upgradeStructure"
}

export interface Action {
    type:ActionType,
    structure:StructureType
}

// export interface SetStructureAmount {
//     type: constants.SET_STRUCTURE_AMOUNT;
//     structure: string,
//     amount: number
// }
// export interface UpgradeStructure {
//     type: constants.SET_STRUCTURE_AMOUNT;
//     structure: StructureType
// }

//export type IncrementSomething = IncrementStructure | IncrementResource; // UNUSED?
//export type StructureAction = SetStructureAmount | UpgradeStructure; 

// export function setStructureAmount(structure:string, amount:number): SetStructureAmount {
//     return {
//         type: constants.SET_STRUCTURE_AMOUNT,
//         structure,
//         amount
//     }
// }

export function upgradeStructure(structure:StructureType): Action {
    console.log("Upgrading " + structure + " now!");
    return {
        type: ActionType.upgradeStructure,
        structure
    }
}