import { Item } from "definitions/items/types";
import * as React from "react";
import { TextManager } from "global/TextManager";
import "components/ui/css/common/icon.css";
import "./css/itemsList.css";
import DraggableItemIcon from 'components/ui/DraggableItemIcon';
import { DragSourceType } from 'constants/dragging';

export interface Props {
    className?: string;
    items: Item[];
    sourceType: DragSourceType;
    sourceId?: string;
}

/**
 * The ItemsList displays a list of items vertically. Shows icon and description
 */
const DraggableItemsList = (props: Props) => {
    const className = (props.className || "") + " itemsbox";

    return (
        <ul className={className} >
            {props.items.map((item, index) => (
                <li
                    key={`${item}${index}`}
                    className="item"
                >
                    <DraggableItemIcon
                        item={item}
                        index={index}
                        sourceId={props.sourceId}
                        sourceType={props.sourceType}
                    />
                    {TextManager.getItemName(item) }
                </li>
            ))}
        </ul>
    );
};

export default DraggableItemsList;
