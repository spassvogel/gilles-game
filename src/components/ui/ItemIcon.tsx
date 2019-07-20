import itemDefinitions from "definitions/items";
import { Item, ItemDefinition } from "definitions/items/types";
import * as React from "react";
import "./css/itemicon.css";

export interface Props  {
    item: Item;
    onClick?: (event: React.MouseEvent) => void;
}

const ItemIcon = (props: Props) => {
    const { item  } =  props;
    const itemDefinition: ItemDefinition = itemDefinitions[item];

    if (!itemDefinition) {
        // tslint:disable-next-line: no-console
        console.warn(`could not find definition for ${item}`);
    }     // todo: [10/07/2019] assert

    const handleClick = (event: React.MouseEvent) => {
        if (props.onClick){
            props.onClick(event);
        }
    }

    return (
        <div className="item-icon"
            onClick = { handleClick }
            style = {{
                backgroundImage: `url(${itemDefinition.iconImg})`,
            }}>
        </div>
    );
};

export default ItemIcon;
