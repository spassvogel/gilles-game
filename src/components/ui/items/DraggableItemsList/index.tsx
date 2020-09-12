import { Item } from "definitions/items/types";
import * as React from "react";
import { TextManager } from "global/TextManager";
import DraggableItemIcon from 'components/ui/DraggableItemIcon';
import { DragSourceType } from 'constants/dragging';
import "components/ui/styles/icon.scss";
import "./itemsList.scss";

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
    const className = (props.className || "")+ " itemslist";

    return (
        <ul className={className} >
            {props.items.map((item, index)=> (
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
                    <div className="text">
                        <p className="name">{TextManager.getItemName(item)}</p>
                        <p className="subtext">{TextManager.getItemSubtext(item)}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default DraggableItemsList;
