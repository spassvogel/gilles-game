import { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { type Action } from 'redux'
import { removeItemFromInventory, assignEquipment, addItemToInventory, removeEquipment, moveItemInInventory } from 'store/actions/adventurers'
import { removeItemFromWarehouse, addItemToWarehouse, moveItemInWarehouse } from 'store/actions/stockpile'
import { type EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type Item, ItemCategory } from 'definitions/items/types'
import { DragSourceType } from 'constants/dragging'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { type InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon'
import { SoundManager } from 'global/SoundManager'
import { useStockpileState } from 'hooks/store/stockpile'
import { getDefinition } from 'definitions/items'
import { type StockpileStoreState } from 'store/types/stockpile'

/* Exposes
- dropItemEquipment,
- dropItemInventory,
- dropItemWarehouse
to use in various places in the UI when an item is dropped somewhere
*/
const useItemDropActions = () => {
  const dispatch = useDispatch()
  const sceneController = useContext(SceneControllerContext) // is only available when in a scene
  const stockpile = useStockpileState()

  // When an item gets dropped on equipment slot
  const dropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType, adventurer: AdventurerStoreState) => {
    const item = dragInfo.item
    const actions: Action[] = []

    void SoundManager.playSound('UI_EQUIP')
    switch (dragInfo.sourceType) {
      // Dragged from inventory
      case DragSourceType.adventurerInventory: {
        actions.push(
          // Item gets removed from inventory
          removeItemFromInventory(adventurer.id, dragInfo.inventorySlot ?? -1),
          // Item gets assigned to an equipment slot
          assignEquipment(adventurer.id, slotType, item)
        )

        const existingEquipment = adventurer.equipment[slotType]
        if (existingEquipment != null) {
          // There is already an item in this slot. Place in inventory
          actions.push(addItemToInventory(adventurer.id, existingEquipment, dragInfo.inventorySlot ?? -1))
        }
        break
      }
      // Dragged from warehouse.
      case DragSourceType.warehouse: {
        const definition = getDefinition(item.type)
        actions.push(
          removeItemFromWarehouse(definition.itemCategory, dragInfo.inventorySlot ?? -1),
          assignEquipment(adventurer.id, slotType, item)
        )

        const existingEquipment = adventurer.equipment[slotType]
        if (existingEquipment != null) {
          // There is already an item in this slot. Place in warehouse
          actions.push(addItemToWarehouse(existingEquipment, dragInfo.inventorySlot ?? -1))
        }
        break
      }

      // Dragged from equipment slot (only applicable to weapons)
      case DragSourceType.adventurerEquipment: {
        actions.push(
          assignEquipment(adventurer.id, slotType, item)
        )

        const existingEquipment = adventurer.equipment[slotType]
        const fromSlot = dragInfo.inventorySlot ?? -1
        if (existingEquipment != null) {
          // Another weapon was there, switch them
          actions.push(assignEquipment(adventurer.id, fromSlot, existingEquipment))
        } else {
          // Clear the slot where it came from
          actions.push(removeEquipment(adventurer.id, fromSlot))
        }
        break
      }
    }
    actions.forEach(a => dispatch(a))
  }

  // When an item gets dropped on an adventurer inventory
  const dropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, adventurer: AdventurerStoreState, sourceId?: string): void => {
    const actions: Action[] = []

    switch (sourceType) {
      // Drag from one inventory slot to another
      case DragSourceType.adventurerInventory:
        actions.push(moveItemInInventory(adventurer.id, fromSlot, toSlot))
        break

      // Dragged from warehouse
      case DragSourceType.warehouse: {
        const definition = getDefinition(item.type)
        actions.push(
          removeItemFromWarehouse(definition.itemCategory, fromSlot),
          addItemToInventory(adventurer.id, item, toSlot)
        )
        const otherItem = adventurer.inventory[toSlot]
        if (otherItem != null) {
          actions.push(
            addItemToWarehouse(otherItem, fromSlot)
          )
        }
        break
      }

      // Drag from equipment slot
      case DragSourceType.adventurerEquipment: {
        actions.push(
          addItemToInventory(adventurer.id, item, toSlot)
        )

        const existingEquipment = adventurer.inventory[toSlot]
        if (existingEquipment != null) {
          // Was dropped on another piece of equipment in inventory, switch them
          actions.push(assignEquipment(adventurer.id, fromSlot, existingEquipment))
        } else {
          // Clear the slot where it came from
          actions.push(removeEquipment(adventurer.id, fromSlot))
        }
        break
      }

      // Dragged from lootCache on a scene
      case DragSourceType.lootCache: {
        if (sceneController != null && sourceId != null) {
          // Let the scene controller handle this action
          sceneController.takeItemFromCache(fromSlot, sourceId, adventurer.id, toSlot)
        }
      }
    }
    actions.forEach(a => dispatch(a))
  }

  // When an item gets dropped on the warehouse inventory
  const dropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId = ''): void => {
    const actions: Action[] = []
    const definition = getDefinition(item.type)
    const stockpileCategory = ItemCategory[definition.itemCategory] as keyof StockpileStoreState

    switch (sourceType) {
      // Dragged from the warehouse itself
      case DragSourceType.warehouse: {
        actions.push(
          moveItemInWarehouse(definition.itemCategory, fromSlot, toSlot)
        )
        const otherItem = stockpile[stockpileCategory][toSlot]
        if (otherItem != null) {
          actions.push(
            addItemToInventory(sourceId, otherItem, fromSlot)
          )
        }
        break
      }
      // Dragged from an adventurer inventory
      case DragSourceType.adventurerInventory: {
        actions.push(
          removeItemFromInventory(sourceId, fromSlot),
          addItemToWarehouse(item, toSlot)
        )
        const otherItem = stockpile[stockpileCategory][toSlot]
        if (otherItem != null) {
          actions.push(
            addItemToInventory(sourceId, otherItem, fromSlot)
          )
        }
        break
      }
      // Drag from equipment slot
      case DragSourceType.adventurerEquipment: {
        actions.push(
          removeEquipment(sourceId, fromSlot),
          addItemToWarehouse(item, toSlot)
        )

        const otherItem = stockpile[stockpileCategory][toSlot]
        if (otherItem != null) {
          actions.push(
            assignEquipment(sourceId, fromSlot, otherItem)
          )
        }
        break
      }
    }
    actions.forEach(a => dispatch(a))
  }
  return {
    dropItemEquipment,
    dropItemInventory,
    dropItemWarehouse
  }
}

export default useItemDropActions
