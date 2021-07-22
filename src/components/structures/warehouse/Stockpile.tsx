import * as React from "react";
import Inventory from "components/ui/inventory/Inventory";
import { DragSourceType } from "constants/dragging";
import { useStockpileState } from "hooks/store/stockpile";
import useItemDropActions from "hooks/actions/useItemActions";
import { Item, ItemType } from "definitions/items/types";
import Tabstrip from "components/ui/tabs/Tabstrip";
import { useMemo, useState } from "react";
import Tab from "components/ui/tabs/Tab";
import { StockpileStoreState } from "store/types/stockpile";
import { TextManager } from "global/TextManager";
import { InventoryItemDragInfo } from "components/ui/items/DraggableItemIcon";
import { getDefinition } from "definitions/items";
import "./styles/stockpile.scss"

const WAREHOUSE = DragSourceType.warehouse;

const Stockpile = () => {
    const stockpile = useStockpileState();
    const {dropItemWarehouse} = useItemDropActions();
    const [selectedItemType, setSelectedItemType] = useState<string>(Object.keys(stockpile)[0]);

    const handleDropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        dropItemWarehouse(item, fromSlot, toSlot, sourceType, sourceId);
    }

    const handleCheckDropItem = (dragInfo: InventoryItemDragInfo) => {
        // can only drop on the appropriate category
        const definition = getDefinition(dragInfo.item)
        return (definition.itemType === ItemType[selectedItemType as keyof typeof ItemType])
    }

    const items = useMemo(() => {
        return stockpile[selectedItemType as keyof StockpileStoreState]
    }, [selectedItemType])

    return (
        <div className="stockpile">
            <Tabstrip className="tabs" onTabSelected={setSelectedItemType} activeTab={selectedItemType}>
                {Object.keys(stockpile).map((itemType) => {
                    return (
                        <Tab id={itemType} key={itemType}>
                            {TextManager.getItemType(ItemType[itemType as keyof typeof ItemType])}
                        </Tab>);
                    }
                )}
            </Tabstrip>
            <Inventory
                sourceType={WAREHOUSE}
                className="inventory-large"
                items={items}
                onDropItem={handleDropItemWarehouse}
                canDropHere={handleCheckDropItem}
            />
        </div>
    )
}

export default Stockpile
