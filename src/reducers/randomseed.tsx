import { AnyAction, Reducer } from "redux";

const initialState = "GILLESROX";

/**
 * reducer
 * @param state
 * @param action
 */
export const randomseed: Reducer<string> = (state: string = initialState, action: AnyAction) => {
    // switch (action.type) {
    //     case ActionType.addResource:
    //         if(state[action.resource] === undefined) return state;

    //         return {
    //             ...state,
    //             [action.resource]: state[action.resource] + action.value
    //         };
    // }
    return state;
};
