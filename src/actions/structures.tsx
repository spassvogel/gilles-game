// tslint:disable:object-literal-sort-keys

import { Structure } from "src/definitions/structures";
import { StructureState } from "src/stores/structure";

export enum ActionType {
    upgradeStructure = "upgradeStructure",
    increaseWorkers = "increaseWorkers",
    decreaseWorkers = "decreaseWorkers",
    setStructureState = "setStructureState",
}

export interface Action {
    type: ActionType;
    structure: Structure;
}
export interface StructureStateAction extends Action {
    state: StructureState;
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

export function setStructureState(structure: Structure, state: StructureState): StructureStateAction {
    return {
        type: ActionType.setStructureState,
        structure,
        state,
    };
}

export function upgradeStructure(structure: Structure): Action {
    return {
        type: ActionType.upgradeStructure,
        structure,
    };
}

// Increases workers by one
export function increaseWorkers(structure: Structure): Action {
    return {
        type: ActionType.increaseWorkers,
        structure,
    };
}

// Decreases workers by one
export function decreaseWorkers(structure: Structure): Action {
    return {
        type: ActionType.decreaseWorkers,
        structure,
    };
}
