// tslint:disable:object-literal-sort-keys

import { Structure } from "src/definitions/structures";
import { StructureState } from "src/stores/structure";

export enum ActionType {
    upgradeStructure = "upgradeStructure",
    increaseWorkers = "increaseWorkers",
    decreaseWorkers = "decreaseWorkers",
    startBuildingStructure = "startBuildingStructure",
    finishBuildingStructure = "finishBuildingStructure",
}

export interface Action {
    type: ActionType;
    structure: Structure;
}
export interface StructureStateAction extends Action {
    state: StructureState;
}

export interface WorkerCountAction extends Action {
    workers: number;
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

// export type IncrementSomething = IncrementStructure | IncrementResource; // UNUSED?
// export type StructureAction = SetStructureAmount | UpgradeStructure;

// export function setStructureAmount(structure:string, amount:number): SetStructureAmount {
//     return {
//         type: constants.SET_STRUCTURE_AMOUNT,
//         structure,
//         amount
//     }
// }

export function startBuildingStructure(structure: Structure): Action {
    return {
        type: ActionType.startBuildingStructure,
        structure,
    };
}

export function finishBuildingStructure(structure: Structure): Action {
    return {
        type: ActionType.finishBuildingStructure,
        structure,
    };
}

export function upgradeStructure(structure: Structure): Action {
    return {
        type: ActionType.upgradeStructure,
        structure,
    };
}

// Increases workers used by given structure by given amount
export function increaseWorkers(structure: Structure, workers: number = 1): WorkerCountAction {
    return {
        type: ActionType.increaseWorkers,
        structure,
        workers,
    };
}

// Decreases workers used by given structure by given amount
export function decreaseWorkers(structure: Structure, workers: number = 1): WorkerCountAction {
    return {
        type: ActionType.decreaseWorkers,
        structure,
        workers,
    };
}
