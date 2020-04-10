import React from "react";
import { AdventurerStoreState } from 'stores/adventurer';
import { EquipmentSlotType } from 'components/ui/EquipmentSlot';
import { Item } from 'definitions/items/types';
import { InventoryItemDragInfo } from 'components/ui/DraggableItemIcon';
import { DragSourceType } from 'constants/dragging';
import AdventurerEquipment from './AdventurerEquipment';
import Inventory from 'components/ui/inventory/Inventory';
import { useDispatch } from 'react-redux';
import { Action } from "redux";

import { removeItemFromInventory, assignEquipment, addItemToInventory, removeEquipment, moveItemInInventory } from 'actions/adventurers';
import { removeItemFromWarehouse, addItemToWarehouse } from 'actions/items';

export interface Props {
    adventurer: AdventurerStoreState;
}

/** Vertical panel showing adventurer info */
const AdventurerPanel = (props: Props) => {
    const { adventurer } = props;
    const dispatch = useDispatch();

    const renderAttributes = () => Object.keys(adventurer.stats).map((stat) => {
        const value: number = adventurer.stats[stat];
        return <div key={`${adventurer.id}-${stat}`} > <b>{stat}</b>: {value.toFixed(1)} </div>;
    });    

    // When an item gets dropped on equipment slot
    const handleDropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => {
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
            // Dragged from warehouse. I dont think this can happen in this AdventurerPanel
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

    // When an item gets dropped on the inventory
    const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        const actions: Action[] = [];        
        switch (sourceType) {
            // Drag from one inventory slot to another
            case DragSourceType.adventurerInventory:
                actions.push(moveItemInInventory(adventurer.id, fromSlot, toSlot))
                break;

            case DragSourceType.warehouse: {
                // Dragged from warehouse
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
        }
        actions.forEach(a => dispatch(a));
    };

    return (
        <div className="adventurer-panel">
            {/* <div className="left"> */}
                <div className="name">
                    <b>{adventurer.name}</b>
                </div>
                <div className="renderAttributes">
                    {renderAttributes()}
                </div>
                <div className="equipment">
                    <AdventurerEquipment adventurer={adventurer} onDropItemEquipment={handleDropItemEquipment} />
                </div>
            {/* </div> */}
            <div className="right">
                <Inventory
                    sourceType={DragSourceType.adventurerInventory}
                    sourceId={adventurer.id}
                    items={adventurer.inventory}
                    className="inventory-medium"
                    onDropItem={handleDropItemInventory}
                /> 
            </div>
        </div>
    )
}

export default AdventurerPanel;