import * as React from "react";
import { Actor, CombatStoreState, CombatActionType } from "stores/combat";
//import "./css/structuredetails.css";

export interface Props {
    actor: Actor;
    activeAction: CombatActionType | null;
    onActivateAction: (name: CombatActionType) => void;
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

    return <fieldset className="combat-controls">
        <legend> { props.actor.name } </legend>
        { createButton(CombatActionType.move)}
        { createButton(CombatActionType.shoot)}
        { createButton(CombatActionType.slash)}
        AP: {props.actor.remainingAP}
    </fieldset>;
};

export default CombatControls;
