import { StoreState } from "stores";
import { Allegiance, CombatAction, CombatStoreState } from "stores/combat";

export interface CombatUpdate {
    action: CombatAction | null;
}

const updateCombat = (delta: number, store: StoreState): CombatUpdate | null => {
    const combat = store.combat;
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
                return {
                    action: null,
                };
            }
        }
    }
    return null;
};

export default updateCombat;
