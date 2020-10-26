import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from "redux";
import { removeItemFromInventory, assignEquipment, addItemToInventory, removeEquipment, moveItemInInventory } from 'store/actions/adventurers';
import { removeItemFromWarehouse, addItemToWarehouse, moveItemInWarehouse } from 'store/actions/items';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { Item } from 'definitions/items/types';
import { DragSourceType } from 'constants/dragging';
import { AdventurerStoreState } from 'store/types/adventurer';
import useStockpileState from 'hooks/store/useStockpileState';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { InventoryItemDragInfo } from 'components/ui/items/DraggableItemIcon';

const useItemDropActions = () => {
    const dispatch = useDispatch();
    const sceneController = useContext(SceneControllerContext);  // is only available when in a scene
    const stockpile = useStockpileState();

    // When an item gets dropped on equipment slot
    const dropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType, adventurer: AdventurerStoreState) => {
        const item = dragInfo.item;
        const actions: Action[] = [];

        switch (dragInfo.sourceType) {
            // Dragged from inventory
            case DragSourceType.adventurerInventory: {
                actions.push(
                    // Item gets removed from inventory
                    removeItemFromInventory(adventurer.id, dragInfo.inventorySlot!),
                    // Item gets assigned to an equipment slot
                    assignEquipment(adventurer.id, slotType, item),
                );

                const existingEquipment = adventurer.equipment[EquipmentSlotType[slotType]];
                if (existingEquipment) {
                    // There is already an item in this slot. Place in inventory
                    actions.push(addItemToInventory(adventurer.id, existingEquipment, dragInfo.inventorySlot!));
                }
                break;
            }
            // Dragged from warehouse.
            case DragSourceType.warehouse: {
                actions.push(
                    removeItemFromWarehouse(dragInfo.inventorySlot!),
                    assignEquipment(adventurer.id, slotType, item),
                );

                const existingEquipment = adventurer.equipment[EquipmentSlotType[slotType]];
                if (existingEquipment) {
                    // There is already an item in this slot. Place in warehouse
                    actions.push(addItemToWarehouse(existingEquipment, dragInfo.inventorySlot!));
                }
                break;
            }

            // Dragged from equipment slot (only applicable to weapons)
            case DragSourceType.adventurerEquipment: {
                actions.push(
                    assignEquipment(adventurer.id, slotType, item)
                );

                const existingEquipment = adventurer.equipment[EquipmentSlotType[slotType]];
                const fromSlot = dragInfo.inventorySlot!;
                if (existingEquipment) {
                    // Another weapon was there, switch them
                    actions.push(assignEquipment(adventurer.id, fromSlot, existingEquipment),)
                } else {
                    // Clear the slot where it came from
                    actions.push(removeEquipment(adventurer.id, fromSlot));
                }
                break;
            }
        }
        actions.forEach(a => dispatch(a));
    };

    // When an item gets dropped on an adventurer inventory
    const dropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, adventurer: AdventurerStoreState, sourceId?: string): void => {
        const actions: Action[] = [];
        switch (sourceType) {
            // Drag from one inventory slot to another
            case DragSourceType.adventurerInventory:
                actions.push(moveItemInInventory(adventurer.id, fromSlot, toSlot))
                break;

            // Dragged from warehouse
            case DragSourceType.warehouse: {
                actions.push(
                    removeItemFromWarehouse(fromSlot),
                    addItemToInventory(adventurer.id, item, toSlot),
                )
                const otherItem = adventurer.inventory[toSlot];
                if (otherItem) {
                    actions.push(
                        addItemToWarehouse(otherItem, fromSlot)
                    )
                }
                break;
            }

            // Drag from equipment slot
            case DragSourceType.adventurerEquipment: {
                actions.push(
                    addItemToInventory(adventurer.id, item, toSlot)
                );

                const existingEquipment = adventurer.inventory[toSlot];
                if (existingEquipment) {
                    // Was dropped on another piece of equipment in inventory, switch them
                    actions.push(assignEquipment(adventurer.id, fromSlot, existingEquipment));
                } else {
                    // Clear the slot where it came from
                    actions.push(removeEquipment(adventurer.id, fromSlot));
                }
                break;
            }

            // Dragged from lootCache on a scene
            case DragSourceType.lootCache: {
                if (sceneController && sourceId) {
                    // Let the scene controller handle this action
                    sceneController.takeItemFromCache(fromSlot, sourceId, adventurer, toSlot);
                }
            }
        }
        actions.forEach(a => dispatch(a));
    };

    // When an item gets dropped on the warehouse inventory
    const dropItemWarehouse = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        const actions: Action[] = [];

        switch (sourceType) {
            // Dragged from the warehouse itself
            case DragSourceType.warehouse: {
                actions.push(
                    moveItemInWarehouse(fromSlot, toSlot)
                )
                const otherItem = stockpile[toSlot];
                if (otherItem) {
                    actions.push(
                        addItemToInventory(sourceId!, otherItem, fromSlot)
                    )
                }
                break;
            }
            // Dragged from an adventurer inventory
            case DragSourceType.adventurerInventory: {
                actions.push(
                    removeItemFromInventory(sourceId!, fromSlot),
                    addItemToWarehouse(item, toSlot)
                )
                const otherItem = stockpile[toSlot];
                if (otherItem) {
                    actions.push(
                        addItemToInventory(sourceId!, otherItem, fromSlot)
                    )
                }
                break;
            }
        }
        actions.forEach(a => dispatch(a));
    };
    return {
        dropItemEquipment,
        dropItemInventory,
        dropItemWarehouse
    }
}

export default useItemDropActions;