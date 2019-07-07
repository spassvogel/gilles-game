import * as React from "react";
import itemsDescription from "src/definitions/items";
import { Item } from "src/definitions/items/types";
import { TextManager } from "src/utils/textManager";
import "./css/itemsbox.css";

export interface Props {
    className?: string;
    items: Item[];
}

export interface StateProps {
    itemsInInventory?: Item[]; // Items that are in `items` array and also in inventory
}

type AllProps = Props & StateProps;

/**
 * The ItemsBox displays a list of items
 */
const ItemsBox = (props: AllProps) => {
    const { itemsInInventory } = props;
    const className = (props.className || "") + " itemsbox";
    const listItems = props.items.map((item: Item) => {
        let listItemClass = "item";
        if (itemsInInventory && itemsInInventory.indexOf(item) === -1) {
            listItemClass += " missing";
        }
        const itemDescription = itemsDescription[item];
        return <li className = { listItemClass } key = { item }>
            <div className = "icon" style = {{
                backgroundImage:  `url(${itemDescription.iconImg})`,
            }}></div>
            <div className = "name">
                { TextManager.getItemName(item) }
            </div>
        </li>;
    });

    return (
        <ul className = { className } >
            { listItems }
        </ul>
    );
};

export default ItemsBox;
