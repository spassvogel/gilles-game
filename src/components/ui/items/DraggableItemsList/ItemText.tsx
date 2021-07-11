import * as React from "react";
import { Item } from "definitions/items/types";
import { TextManager } from "global/TextManager";

interface Props {
    item: Item;
}

const ItemText = ({ item }: Props) => (
    <div className="text">
        <p className="name">{TextManager.getItemName(item)}</p>
        <p className="subtext">{TextManager.getItemSubtext(item)}</p>
    </div>
)

export default ItemText;