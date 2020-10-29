// tslint:disable:object-literal-sort-keys

import { Structure } from "definitions/structures";
import { Action } from "redux";
import { StructureState } from "store/types/structure";
import { Item } from 'definitions/items/types';

export enum ActionType {
    upgradeStructure = "upgradeStructure",
    increaseWorkers = "increaseWorkers",
    decreaseWorkers = "decreaseWorkers",
    startBuildingStructure = "startBuildingStructure",
    finishBuildingStructure = "finishBuildingStructure",
    setStructureState = "setStructureState",
    addItemToToProduces = "addItemToToProduces",
}

export interface StructureAction extends Action<ActionType> {
    structure: Structure;
}
export interface StructureStateAction extends StructureAction {
    state: StructureState;
}
export interface AddItemToProducesAction extends StructureAction {
    item: Item;
}

export interface WorkerCountAction extends StructureAction {
    workers: number;
}

export function startBuildingStructure(structure: Structure): StructureAction {
    return {
        type: ActionType.startBuildingStructure,
        structure,
    };
}

export function finishBuildingStructure(structure: Structure): StructureAction {
    return {
        type: ActionType.finishBuildingStructure,
        structure,
    };
}

export function upgradeStructure(structure: Structure): StructureAction {
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

export function setStructureState(structure: Structure, state: StructureState): StructureStateAction {
    return {
        type: ActionType.setStructureState,
        structure,
        state,
    };
}

export function addItemToToProduces(structure: Structure, item: Item): AddItemToProducesAction {
    return {
        type: ActionType.addItemToToProduces,
        structure,
        item,
    };
}
