import { ApparelDefinition } from "definitions/items/apparel";
import { DeedDefinition } from "definitions/items/deeds";
import { ItemDefinition, ItemType } from "definitions/items/types";
import { WeaponDefinition } from "definitions/items/weapons";
import { Structure } from "definitions/structures";
import * as React from "react";
import { StoreState } from "stores";
import DeedContent from './DeedContent';
import WeaponContent from './WeaponContent';
import ApparelContent from './ApparelContent';
import { TextManager } from 'global/TextManager';

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

const ItemContext = (props: Props) => {

    const info = props.info;
    switch (info.itemType) {
        case ItemType.deed:
           return <DeedContent info={info as DeedDefinition} />;

        case ItemType.weapon:
            return <WeaponContent info={info as WeaponDefinition} />;

        case ItemType.apparel:
            return <ApparelContent info={info as ApparelDefinition} />;

        default:
            const subtext = TextManager.getItemSubtext(info.item);
            return (subtext && (<p>"{subtext}"</p>)) || null;
    }
}
export default ItemContext;