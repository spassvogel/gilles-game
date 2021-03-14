import * as React from "react";
import { isApparel } from "definitions/items/apparel";
import { isDeed } from "definitions/items/deeds";
import { Item } from "definitions/items/types";
import { isWeapon } from "definitions/items/weapons";
import DeedContent from './DeedContent';
import WeaponContent from './WeaponContent';
import ApparelContent from './ApparelContent';
import { TextManager } from 'global/TextManager';
import "./styles/itemContext.scss";
import { isPotion } from "definitions/items/potions";
import PotionContent from "./PotionContent";

export interface Props {
    item: Item;
}

const ItemContext = (props: Props) => {
    const { item } = props;
    if (isDeed(item)) {
        return <DeedContent item={item} />;
    }
    if (isWeapon(item)) {
        return <WeaponContent item={item} />;
    }
    if (isWeapon(item)) {
        return <WeaponContent item={item} />;
    }
    if (isApparel(item)) {
        return <ApparelContent item={item} />;
    }
    if (isPotion(item)) {
        return <PotionContent item={item} />;
    }
    const subtext = TextManager.getItemSubtext(item);
    return (subtext && (<p className="subtext">{`"${subtext}"`}</p>)) || null;
}
export default ItemContext;