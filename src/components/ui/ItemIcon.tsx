import * as React from "react";
import itemDefinitions from "src/definitions/items";
import { Item, ItemDefinition } from "src/definitions/items/types";
import "./css/itemicon.css";

export interface Props  {
    item: Item;
    onClick?: () => void;
}

const ItemIcon = (props: Props) => {
    const { item  } =  props;
    const itemDefinition: ItemDefinition = itemDefinitions[item];

    if (!itemDefinition) {
        console.warn(`could not find definition for ${item}`);
    }     // todo: [10/07/2019] assert

    return (
        <div className="item-icon"
            onClick = { props.onClick }
            style = {{
                backgroundImage: `url(${itemDefinition.iconImg})`,
            }}>
        </div>
    );
};

export default ItemIcon;
