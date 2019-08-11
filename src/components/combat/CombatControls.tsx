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
    return <fieldset className="combat-controls">
        <legend> { props.actor.name } </legend>
        <button onClick={() => props.onActivateAction(CombatActionType.move)} className={ props.activeAction === CombatActionType.move ? "active" : "" }>move</button>
        <button onClick={() => props.onActivateAction(CombatActionType.shoot)} className={ props.activeAction === CombatActionType.shoot ? "active" : ""}>shoot</button>
        <button onClick={() => props.onActivateAction(CombatActionType.slash)} className={ props.activeAction === CombatActionType.slash ? "active" : ""}>slash</button>
        AP: {props.actor.remainingAP}
    </fieldset>;
};

export default CombatControls;
