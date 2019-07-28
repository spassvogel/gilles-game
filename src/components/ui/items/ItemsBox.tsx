import "components/ui/css/common/icon.css";
import itemsDescription from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import { TextManager } from "utils/textManager";
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
 * The ItemsBox displays a list of items, to be used as requirements for something
 */
const ItemsBox = (props: AllProps) => {
    const { itemsInInventory } = props;
    const className = (props.className || "") + " itemsbox";
    const aggregate = props.items.reduce((accumulator: object, current: Item) => {
        if (!accumulator[current]) {
            accumulator[current] = 0;
        }
        accumulator[current]++;
        return accumulator;
    }, {});

    const listItems = Object.keys(aggregate).map((key: string) => {
        const item = key as Item;
        const amount = aggregate[key] as number;
        let listItemClass = "item";

        // Check if we have enough
        const amountInInventory = itemsInInventory ? itemsInInventory.filter((i) => i === item).length : 0;
        if (amount > amountInInventory) {
            listItemClass += " missing";
        }
        const itemDescription = itemsDescription[item];
        return <li className = { listItemClass } key = { item }>
            <div className = "icon common-icon-smallest" style = {{
                backgroundImage: `url(${itemDescription.iconImg})`,
            }}></div>
            <div className = "name">
                { `${TextManager.getItemName(item)} (${ amount })` }
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
