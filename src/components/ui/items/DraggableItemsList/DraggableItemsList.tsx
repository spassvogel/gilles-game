import { Item } from "definitions/items/types";
import * as React from "react";
import { TextManager } from "global/TextManager";
import { DragSourceType } from 'constants/dragging';
import DraggableItemIcon from '../DraggableItemIcon';
import ItemText from "./ItemText";
import "./styles/itemsList.scss";

export interface Props {
    className?: string;
    items: Item[];
    sourceType: DragSourceType;
    sourceId?: string;
    slots?: number; // optionally always show this amount of slots
}

/**
 * The ItemsList displays a list of items vertically. Shows icon and description
 */
const DraggableItemsList = (props: Props) => {
    const className = `items-list ${props.className ?? ''}`;
    const slots = props.slots ?? props.items.length;

    return (
        <ul className={className} >
            {[...Array(slots)].map((_, index )=> {
                const item = props.items[index]; 
                return (
                    <li
                        key={`${item}${index}`}
                        className="item-row"
                    >
                        <div className="item-placeholder" />
                        { item && (
                            <>
                                <DraggableItemIcon
                                    item={item}
                                    index={index}
                                    sourceId={props.sourceId}
                                    sourceType={props.sourceType}
                                />
                                <ItemText item={item} />
                            </>
                        )}
                    </li>
                )
            })}
        </ul>
    );
};

export default DraggableItemsList;
