import DraggableItemIcon, {InventoryItemDragInfo} from "components/ui/DraggableItemIcon";
import { ContextType } from "constants/context";
import { DragSourceType } from "constants/dragging";
import itemDefinitions from "definitions/items";
import {Item} from "definitions/items/types";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import * as React from "react";
import "./css/inventory.css";
import InventorySlot from "./InventorySlot";

export interface Props {
    items: Array<Item|null>;
    sourceId?: string;   // who does this inventory belong to?
    sourceType: DragSourceType;
    onDropItem: (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string) => void;
}

/**
 * Inventory is used to show Items. They can be dragged about
 * @param props
 */
const Inventory = (props: Props & AppContextProps) => {
    const slots = [];
    for (let i = 0; i < props.items.length; i++) {
        let contents;
        const item = props.items[i];
        const handleDrop = (dragInfo: InventoryItemDragInfo) => {
            /*if (dragInfo.inventorySlot === i && dragInfo.sourceType === props.sourceType && dragInfo.sourceId === props.sourceId) {
                // TODO: Swap items?!
                return;
            }*/

            if (props.onDropItem) {
                const {inventorySlot: fromSlot} = dragInfo;
                props.onDropItem(dragInfo.item, fromSlot!, i, dragInfo.sourceType, dragInfo.sourceId);
           }
       };

        if (item) {
            const handleClick = (event: React.MouseEvent) => {
                const origin = (event.currentTarget as HTMLElement).getBoundingClientRect();
                props.onContextualObjectActivated(
                    ContextType.item,
                    itemDefinitions[item],
                    origin,
                );
           };

            contents = <DraggableItemIcon
                index = {i}
                sourceId = {props.sourceId}
                sourceType = {props.sourceType}
                item = {item}
                onClick = { handleClick }
            >
            </DraggableItemIcon>;
       }

        const slot = <InventorySlot
            key = {`inventory-slot-${i}`}
            empty = {contents === undefined}
            onDrop = {handleDrop}>
                {contents}
        </InventorySlot>;
        slots.push(slot);
   }
    return <div className="inventory">
        {slots}
    </div>;
};
export default withAppContext(Inventory);
