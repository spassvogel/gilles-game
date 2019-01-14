import * as React from "react";
import { AppContextProps } from "src/components/App";
import ItemIcon, { InventoryItemDragInfo } from "src/components/ui/ItemIcon";
import { Item } from "src/definitions/items/types";
import { withAppContext } from "src/hoc/withAppContext";
import InventorySlot from "./InventorySlot";
import { ContextType } from "src/constants";
import itemDefinitions from "src/definitions/items";

export interface Props {
    items: Array<Item|null>;
    source: string;
    onMoveItem: (fromSlot: number, toSlot: number) => void;
}

const Inventory = (props: Props & AppContextProps) => {
    const slots = [];
    for (let i = 0; i < props.items.length; i++) {
        let contents;
        const item = props.items[i];
        const handleDrop = (dragInfo: InventoryItemDragInfo) => {
            if (dragInfo.inventorySlot === i) {
                return;
            }

            if (props.onMoveItem) {
                const { inventorySlot: fromSlot} = dragInfo;
                props.onMoveItem(fromSlot!, i);
            }
        };

        if (item) {

            const handleClick = () => {
                props.onContextualObjectActivated(
                    ContextType.item,
                    itemDefinitions[item],
                );
            };

            contents = <ItemIcon
                index = {i}
                source = { props.source }
                item = { item }
                onClick = { () => handleClick() }
            >
            </ItemIcon>;
        }

        const slot = <InventorySlot
            key= { `inventory-slot-${i}`}
            empty = { contents === undefined }
            onDrop= { handleDrop }>
                { contents }
        </InventorySlot>;
        slots.push(slot);
    }
    return <div className="inventory">
        { slots }
    </div>;
};
// TODO: read https://stackoverflow.com/questions/51083920/how-to-handle-props-injected-by-hoc-in-react-with-typescript
export default withAppContext(Inventory) as React.ComponentType<Props>;
