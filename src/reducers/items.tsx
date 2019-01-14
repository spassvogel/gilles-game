
import { AnyAction, Reducer } from "redux";
import { ActionType as GameActionType, GameTickAction } from "src/actions/game";
import { Item } from "src/definitions/items/types";

/**
 * reducer
 * @param state
 * @param action
 */
export const items: Reducer<Array<Item|null>> = (state: Array<Item|null> = [],
                                                 action: AnyAction| GameTickAction) => {

    switch (action.type) {
    }
    return state;
};
