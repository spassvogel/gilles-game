import { Reducer } from "redux";
import { Action, ActionType, AddAction } from "src/actions/equipment";
import { EquipmentStoreState, initialState } from "../stores/equipment";

/**
 * Equipment reducer
 * @param state
 * @param action
 */
export const equipment: Reducer<EquipmentStoreState> = (state: EquipmentStoreState = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.addEquipment: {
            const name = (action as AddAction).equipment;
            return {
                ...state,
                [name]: state[name] + 1,
            };
        }
    }
    return state;
};
