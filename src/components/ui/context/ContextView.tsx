
import { ContextInfo, ContextType } from "constants/context";
import ItemContext from "containers/ui/context/ItemContext";
import { Item, ItemType } from "definitions/items/types";
import { Structure } from "definitions/structures";
import * as React from "react";
import { TextManager } from "utils/textManager";
import "./css/contextview.css";

export interface Props {
    type: ContextType | null;
    info: ContextInfo | null;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

/**
 * The ContextView shows the player contextual information about the item she clicked
 * @param props
 */
export default function(props: Props & DispatchProps) {
    let info = props.info;
    if (!info) {
        info = {
            item: Item.deedForWeaponsmith,
            itemType: ItemType.weapon,
            subText: "It allows for the construction of a weaponsmith",
            iconImg: "/img/items/deeds/deed.png",
        };
    }
    let content;

    switch (props.type) {
        case ContextType.item:
        default:
            content = <ItemContext info= { info } />;
    }

    const name = TextManager.getItemName(info.item);
    return (
        <fieldset className="contextbox">
            <legend> { name } </legend>
            { content }
        </fieldset>
    );
}
