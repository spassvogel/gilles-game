
import { DeedDefinition } from "definitions/items/deeds";
import { ItemDefinition, ItemType } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import * as React from "react";
import { StoreState } from "stores";
import { StructureState } from "stores/structure";

export interface Props {
    info: ItemDefinition;
}
export interface StateProps {
    store: StoreState;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
    handleStartConstruction: (structure: Structure) => void;
}

export default function(props: Props & DispatchProps & StateProps) {
    const info = props.info;
    switch (info.itemType) {
        case ItemType.deed:
            const gold = props.store.gold;
            const deedInfo = info as DeedDefinition;
            const structureDefinition = getDefinition(deedInfo.structure);
            const enoughGold = structureDefinition.cost.gold || 0 <= gold;
            const structureStoreState = props.store.structures[deedInfo.structure];
            const canBeBuilt = structureStoreState.state === StructureState.NotBuilt;
            const disabled = !canBeBuilt || !enoughGold;
            return <div>
                <p> " { info.subText } " </p>
                <button disabled={ disabled } onClick= { () => props.handleStartConstruction(deedInfo.structure) }>
                    Start construction ({ structureDefinition.cost.gold } gold)
                </button>
            </div>;
        default:
            return (
                <p> " { info.subText } " </p>
            );
    }
}
