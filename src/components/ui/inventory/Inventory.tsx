import * as React from "react";
import { DragSourceType } from "constants/dragging";
import {Item} from "definitions/items/types";
import InventorySlot from "./InventorySlot";
import DraggableItemIcon, { InventoryItemDragInfo } from '../items/DraggableItemIcon';
import "./styles/inventory.scss";
import { IconSize } from '../common/Icon';

export interface Props {
    items: (Item|null)[];
    sourceId?: string;   // who does this inventory belong to?
    sourceType: DragSourceType;
    iconSize?: IconSize;
    onDropItem: (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => void;
    className?: string;
}

/**
 * Inventory is used to show Items. They can be dragged about
 * @param props
 */
const Inventory = (props: Props) => {
    const slots = [];
    for (let i = 0; i < props.items.length; i++) {
        let contents;
        const item = props.items[i];
        const handleDrop = (dragInfo: InventoryItemDragInfo) => {
            if (dragInfo.inventorySlot === i && dragInfo.sourceType === props.sourceType && dragInfo.sourceId === props.sourceId) {
                // TODO: Swap items?!
                return;
            }
            if (props.onDropItem && dragInfo.inventorySlot !== undefined) {
                const {inventorySlot: fromSlot} = dragInfo;
                props.onDropItem(dragInfo.item, fromSlot, i, dragInfo.sourceType, dragInfo.sourceId);
           }
        };

        if (item) {
            contents = (
                <DraggableItemIcon
                    index={i}
                    sourceId={props.sourceId}
                    sourceType={props.sourceType}
                    item={item}
                />
            );
       }

        const slot = (
            <InventorySlot
                key={`inventory-slot-${i}`}
                item={item}
                size={props.iconSize}
                onDrop={handleDrop}
            >
                {contents}
            </InventorySlot>
        );
        slots.push(slot);
   }
    return (
        <div className={`inventory ${props.className ? props.className : ""}`}>
            {slots}
        </div>
    );
};
export default Inventory;
