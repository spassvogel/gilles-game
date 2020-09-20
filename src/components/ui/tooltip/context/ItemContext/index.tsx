import * as React from "react";
import { ApparelDefinition } from "definitions/items/apparel";
import { DeedDefinition } from "definitions/items/deeds";
import { ItemDefinition, ItemType } from "definitions/items/types";
import { WeaponDefinition } from "definitions/items/weapons";
import DeedContent from './DeedContent';
import WeaponContent from './WeaponContent';
import ApparelContent from './ApparelContent';
import { TextManager } from 'global/TextManager';
import "./styles/itemContext.scss";

export interface Props {
    info: ItemDefinition;
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
            return (subtext && (<p className="subtext">"{subtext}"</p>)) || null;
    }
}
export default ItemContext;