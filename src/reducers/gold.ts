import { ActionType, ModifyGoldAction } from "actions/gold";
import { Action as StructureAction,
    ActionType as StructureActionType } from "actions/structures";
import structureDefinitions, { Structure } from "definitions/structures";
import { AnyAction, Reducer } from "redux";

/**
 * reducer
 * @param state
 * @param action
 */
export const gold: Reducer<number> = (state: number = 0, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addGold:
            // Adds (or subtract, if negative) gold from the players gold supply
            return state + (action as ModifyGoldAction).amount;

        case StructureActionType.startBuildingStructure:
            // Started building a structure
            const structureDefinition = structureDefinitions[(action as StructureAction).structure];
            const cost = structureDefinition.cost.gold || 0;
            return state - cost;
    }
    return state;
};
