import { clearCombatAction, moveActor } from "actions/combat";
import { Store } from "redux";
import { StoreState } from "stores";
import { Allegiance, CombatAction, CombatActionType } from "stores/combat";

// tslint:disable-next-line: no-empty-interface
export interface CombatUpdate  {
    // todo: maybe this is not needed
    action: CombatAction | null;
}

const updateCombat = (delta: number, store: Store<StoreState>): CombatUpdate | null => {
    const state = store.getState();
    const combat = state.combat;
    if (combat.action) {
        const action = combat.action;
        if (action.endsAt < Date.now()) {
            if (combat.turn === Allegiance.enemy) {
                /* if (apLeft(enemy))
                determine next action
                else
                players turn now
                */
            } else if (combat.turn === Allegiance.player) {
                switch (combat.action.type) {
                    case CombatActionType.move:
                        store.dispatch(moveActor(combat.action.actor, combat.action.target));
                        store.dispatch(clearCombatAction());
                        break;
                    default:
                        break;
                }
                return {
                    action: null,
                };
            }
        }
    }
    return null;
};

export default updateCombat;
