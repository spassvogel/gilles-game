import { ActionType, AddCombatActionAction, MoveActorAction } from "store/actions/combat";
import { AnyAction, Reducer } from "redux";
import { barBrawl, CombatStoreState } from "store/types/combat";

/**
 * reducer
 * @param state
 * @param action
 */
export const combat: Reducer<CombatStoreState> = (state: CombatStoreState = barBrawl, action: AnyAction) => {
    switch (action.type) {
        case ActionType.startCombatAction:
            const addAction = action as AddCombatActionAction;

            return {
                ...state,
                action: {
                    actor: addAction.actor,
                    endsAt: addAction.endsAt,
                    target: addAction.target,
                    type: addAction.combatType,
                },
            };

        case ActionType.moveActor:
            const moveAction = action as MoveActorAction;

            // Moves an actor to another position
            const actors = state.actors.map((a) => {
                if (a.name === moveAction.actor) {
                    return {
                        ...a,
                        location: moveAction.location,
                    };
                }
                return a;
            });

            return {
                ...state,
                actors,
            };

            case ActionType.clearCombatAction:
            // Clears current combat action
            return {
                ...state,
                action: undefined,
            };
    }
    return state;
};
