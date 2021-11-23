import * as React from "react";
import { ItemType } from "definitions/items/types";
import { TextManager } from "global/TextManager";

interface Props {
  item: ItemType;
}

const ItemText = ({ item }: Props) => (
  <div className="text">
    <p className="name">{TextManager.getItemName(item)}</p>
    <p className="subtext">{TextManager.getItemSubtext(item)}</p>
  </div>
)

export default ItemText;
