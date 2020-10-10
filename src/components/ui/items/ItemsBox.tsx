import itemsDescription from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import { TextManager } from "global/TextManager";
import "components/ui/styles/icon.scss";
import "./css/itemsbox.css";
import useStockpileState from 'hooks/store/useStockpileState';
import { useMemo } from 'react';
import { getClassName, IconSize } from 'constants/icons';

export interface Props {
    className?: string;
    items: Item[];

   // itemsInInventory?: Item[]; // Items that are in `items` array and also in inventory
}


/**
 * The ItemsBox displays a list of items, to be used as requirements for something
 */
const ItemsBox = (props: Props) => {
    const { items } = props;
    const className = (props.className || "") + " itemsbox";
    const aggregate = items.reduce((accumulator: object, current: Item) => {
        if (!accumulator[current]) {
            accumulator[current] = 0;
        }
        accumulator[current]++;
        return accumulator;
    }, {});

    const stockpile = useStockpileState();
    const itemsInInventory: Item[] = useMemo(() => {
        const tmpWarehouse = [ ...stockpile];
        const tmpItems: Item[] = [];
        items.forEach((item: Item) => {
            const found = tmpWarehouse.findIndex((i) => i === item);
            if (found > -1) {
                // Remove the item from tmpWarehouse and add to itemsInInventory
                const [ removed ] = tmpWarehouse.splice(found, 1);
                if (removed) {
                    tmpItems.push(removed);
                }
            }
        });
        return tmpItems;
    }, [items, stockpile]);


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
        return <li className={listItemClass} key={item}>
            <div
                className={`icon ${getClassName(IconSize.smallest)}`}
                style={{ backgroundImage: `url(${process.env.PUBLIC_URL}${itemDescription.iconImg})`}}
            />
            <div className="name">
                { `${TextManager.getItemName(item)} (${ amount })` }
            </div>
        </li>;
    });

    return (
        <ul className={className} >
            {listItems}
        </ul>
    );
};

export default ItemsBox;
