import { useEffect, useMemo, useState } from 'react'
import { useDragDropManager } from 'react-dnd'
import Inventory from 'components/ui/inventory/Inventory'
import { DragSourceType, DragType } from 'constants/dragging'
import { useStockpileState } from 'hooks/store/stockpile'
import useItemDropActions from 'hooks/actions/useItemActions'
import { type Item, ItemCategory } from 'definitions/items/types'
import Tabstrip from 'components/ui/tabs/Tabstrip'
import Tab from 'components/ui/tabs/Tab'
import { type StockpileStoreState } from 'store/types/stockpile'
import * as TextManager from 'global/TextManager'
import { getDefinition } from 'definitions/items'
import { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import './styles/stockpile.scss'

const WAREHOUSE = DragSourceType.warehouse

const Stockpile = () => {
  const stockpile = useStockpileState()
  const { dropItemWarehouse } = useItemDropActions()
  const [selectedItemCategory, setSelectedItemCategory] = useState<string>(Object.keys(stockpile)[0])

  const handleDropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
    dropItemWarehouse(item, fromSlot, toSlot, sourceType, sourceId)
  }
  const dragDropManager = useDragDropManager()
  const dragging = dragDropManager.getMonitor().isDragging()

  useEffect(() => {
    // If we're dragging some item, switch to the appropriate category so we can drop it here
    if (dragging) {
      const dragItem: InventoryItemDragInfo = dragDropManager.getMonitor().getItem()
      const dragItemType = dragDropManager.getMonitor().getItemType()

      if (dragItem && dragItemType === DragType.ITEM) {
        const item = dragItem.item
        const definition = getDefinition(item.type)
        setSelectedItemCategory(ItemCategory[definition.itemCategory])
      }
    }
  }, [dragDropManager, dragging])

  const handleCheckDropItem = (dragInfo: InventoryItemDragInfo) => {
    // can only drop on the appropriate category
    const definition = getDefinition(dragInfo.item.type)
    return (definition.itemCategory === ItemCategory[selectedItemCategory as keyof typeof ItemCategory])
  }

  const items = useMemo(() => {
    return stockpile[selectedItemCategory as keyof StockpileStoreState]
  }, [selectedItemCategory, stockpile])

  return (
    <div className="stockpile">
      <Tabstrip className="tabs auto-collapse" onTabSelected={setSelectedItemCategory} activeTab={selectedItemCategory}>
      {Object.keys(stockpile).map((itemCategory) => {
        return (
          <Tab id={itemCategory} key={itemCategory}>
            {TextManager.getItemCategory(ItemCategory[itemCategory as keyof typeof ItemCategory])}
          </Tab>)
      })}
      </Tabstrip>
      <Inventory
        sourceType={WAREHOUSE}
        items={items}
        onDropItem={handleDropItemWarehouse}
        // onStartDrag={handleStartDrag}
        canDropHere={handleCheckDropItem}
      />
    </div>
  )
}

export default Stockpile
