
import * as React from "react";
import { DeedDefinition } from "src/definitions/items/deeds";
import { ItemDefinition, ItemType } from "src/definitions/items/types";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StoreState } from "src/stores";
import { StructureState } from "src/stores/structure";

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
            const structureDefinition = structureDefinitions[deedInfo.structure];
            const enoughGold = structureDefinition.goldCost <= gold;
            const structureStoreState = props.store.structures[deedInfo.structure];
            const canBeBuilt = structureStoreState.state === StructureState.NotBuilt;
            const disabled = !canBeBuilt || !enoughGold;
            return <div>
                <p> " { info.subText } " </p>
                <button disabled={ disabled } onClick= { () => props.handleStartConstruction(deedInfo.structure) }>
                    Start construction ({ structureDefinition.goldCost } gold)
                </button>
            </div>;
        default:
            return (
                <p> " { info.subText } " </p>
            );
    }
}
