import * as React from "react";
import {AppContextProps} from "src/components/App";
import DraggableItemIcon, {InventoryItemDragInfo} from "src/components/ui/DraggableItemIcon";
import {ContextType, DragSourceType} from "src/constants";
import itemDefinitions from "src/definitions/items";
import {Item} from "src/definitions/items/types";
import {withAppContext} from "src/hoc/withAppContext";
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
            const handleClick = () => {
                props.onContextualObjectActivated(
                    ContextType.item,
                    itemDefinitions[item],
                );
           };

            contents = <DraggableItemIcon
                index={i}
                sourceId={props.sourceId}
                sourceType={props.sourceType}
                item={item}
                onClick={() => handleClick()}
            >
            </DraggableItemIcon>;
       }

        const slot = <InventorySlot
            key= {`inventory-slot-${i}`}
            empty={contents === undefined}
            onDrop={handleDrop}>
                {contents}
        </InventorySlot>;
        slots.push(slot);
   }
    return <div className="inventory">
        {slots}
    </div>;
};
// TODO: read https://stackoverflow.com/questions/51083920/how-to-handle-props-injected-by-hoc-in-react-with-typescript
// or: https://stackoverflow.com/questions/50644696/typescript-react-alias-hoc-to-use-component-alias-typing-issues
export default withAppContext(Inventory) as React.ComponentType<Props>;
