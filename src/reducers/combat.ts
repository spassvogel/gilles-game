import { ActionType, AddAction } from "actions/combat";
import { AnyAction, Reducer } from "redux";
import { barBrawl, CombatStoreState } from "stores/combat";

/**
 * reducer
 * @param state
 * @param action
 */
export const combat: Reducer<CombatStoreState> = (state: CombatStoreState = barBrawl, action: AnyAction) => {
    switch (action.type) {
        case ActionType.startAction:
            const addAction = action as AddAction;

            return {
                ...state,
                action: {
                    actor: addAction.actor,
                    endsAt: addAction.endsAt,
                    target: addAction.target,
                    type: addAction.combatType,
                },
            };
    }
    return state;
};
