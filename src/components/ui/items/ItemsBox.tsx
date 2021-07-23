import * as React from "react";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import { TextManager } from "global/TextManager";
import { useMemo } from 'react';
import Icon from 'components/ui/common/Icon';
import { useStockpileStateFlat } from "hooks/store/stockpile";
import "./styles/itemsBox.scss";

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
    const className = (props.className || "") + " items-box";
    const aggregate = items.reduce<{[key: string]: number}>((acc, value) => {
        if (!acc[value]) {
            acc[value] = 0;
        }
        acc[value]++;
        return acc;
    }, {});

    const stockpile = useStockpileStateFlat();
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
        const itemDescription = getDefinition(item);
        return (
            <li className={listItemClass} key={item}>
                <Icon
                    image={itemDescription.iconImg}
                    size="smallest"
                />
                <div className="name">
                    { `${TextManager.getItemName(item)} (${ amount })` }
                </div>
            </li>
        );
    });

    return (
        <ul className={className} >
            {listItems}
        </ul>
    );
};

export default ItemsBox;
