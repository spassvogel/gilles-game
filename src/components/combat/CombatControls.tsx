import * as React from "react";
import { Actor, CombatActionType } from "stores/combat";

export interface Props {
    actor: Actor;
    activeAction: CombatActionType | null;
    onActivateAction: (name: CombatActionType) => void;
    disabled: boolean;
}

type AllProps = Props;

const CombatControls = (props: AllProps) => {
    const costs = {
        [CombatActionType.move]: 1,
        [CombatActionType.shoot]: 3,
        [CombatActionType.slash]: 2,
    };

    const createButton = (actionType: CombatActionType) => {
        const cost = costs[actionType];
        const enoughAP = cost <= props.actor.remainingAP;
        const enabled = enoughAP;
        return (
            <button 
                disabled = { !enabled }
                onClick = {() => props.onActivateAction(actionType)}
                className={ props.activeAction === actionType ? "active" : "" }
            >{ `${actionType} (${cost})` }</button>
        );
    }

    return <fieldset className="combat-controls" disabled={props.disabled}>
        <legend> { props.actor.name } </legend>
        { createButton(CombatActionType.move)}
        { createButton(CombatActionType.shoot)}
        { createButton(CombatActionType.slash)}
        AP: {props.actor.remainingAP}
    </fieldset>;
};

export default CombatControls;
