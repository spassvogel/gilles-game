import { Structure } from 'src/definitions/structures';

export enum ActionType {
    upgradeStructure = "upgradeStructure",
    increaseWorkers = "increaseWorkers",
    decreaseWorkers = "decreaseWorkers"
}

export interface Action {
    type:ActionType,
    structure:Structure
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

export function upgradeStructure(structure:Structure): Action {
    console.log("Upgrading " + structure + " now!");
    return {
        type: ActionType.upgradeStructure,
        structure
    }
}

// Increases workers by one
export function increaseWorkers(structure:Structure): Action {
    return {
        type: ActionType.increaseWorkers,
        structure
    }
}

// Decreases workers by one
export function decreaseWorkers(structure:Structure): Action {
    return {
        type: ActionType.decreaseWorkers,
        structure
    }
}