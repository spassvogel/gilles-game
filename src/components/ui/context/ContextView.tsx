import { ContextInfo, ContextType } from "constants/context";
import ItemContext from "containers/ui/context/ItemContext";
import { Item, ItemType } from "definitions/items/types";
import { PopupProps, withPopup } from "hoc/withPopup";
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

type AllProps = Props & DispatchProps & PopupProps;
/**
 * The ContextView shows the player contextual information about the item she clicked
 * @param props
 */
const ContextView = (props: AllProps) => {
    let { info } = props;
    const { type } = props;

    if (!info) {
        info = {
            iconImg: "/img/items/deeds/deed.png",
            item: Item.deedForWeaponsmith,
            itemType: ItemType.weapon,
            subText: "It allows for the construction of a weaponsmith",
        };
    }
    let content;

    switch (type) {
        case ContextType.item:
        default:
            content = <ItemContext info= { info } />;
    }

    const name = TextManager.getItemName(info.item);
    return <div className = "contextbox">
        <div>{ name } </div>
        { content }
    </div>;
}

export default withPopup<AllProps>(ContextView);
