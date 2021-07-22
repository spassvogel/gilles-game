import * as React from "react";
import { DragSourceType } from "constants/dragging";
import {Item} from "definitions/items/types";
import InventorySlot from "./InventorySlot";
import DraggableItemIcon, { InventoryItemDragInfo } from '../items/DraggableItemIcon';
import { IconSize } from '../common/Icon';
import "./styles/inventory.scss";

export interface Props {
    items: (Item|null)[];
    sourceId?: string;   // who does this inventory belong to?
    sourceType: DragSourceType;
    iconSize?: IconSize;
    className?: string;
    onDropItem: (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => void;
    canDropHere?: (dragInfo: InventoryItemDragInfo) => boolean;
}

/**
 * Inventory is used to show Items. They can be dragged about
 * @param props
 */
const Inventory = (props: Props) => {
    const { items, canDropHere } = props;
    const slots = [];
    for (let i = 0; i < items.length; i++) {
        let contents;
        const item = items[i];
        const handleDrop = (dragInfo: InventoryItemDragInfo) => {
            if (dragInfo.inventorySlot === i && dragInfo.sourceType === props.sourceType && dragInfo.sourceId === props.sourceId) {
                return;
            }
            if (props.onDropItem && dragInfo.inventorySlot !== undefined) {
                const {inventorySlot: fromSlot} = dragInfo;
                props.onDropItem(dragInfo.item, fromSlot, i, dragInfo.sourceType, dragInfo.sourceId);
           }
        };

        const handleCheckDrop = (dragInfo: InventoryItemDragInfo) => {
            return canDropHere ? canDropHere(dragInfo) : true;
        }

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
                canDropHere={handleCheckDrop}
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
