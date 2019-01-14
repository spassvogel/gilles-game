import * as React from "react";
import itemDefinitions from "src/definitions/items";
import { Item, ItemDefinition } from "src/definitions/items/types";

export interface Props  {
    item: Item;
    onClick?: () => void;
}

const ItemIcon = (props: Props) => {
    const { item  } =  props;
    const itemDefinition: ItemDefinition = itemDefinitions[item];

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
