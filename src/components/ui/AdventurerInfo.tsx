import { ContextType } from "constants/context";
import { DragSourceType } from "constants/dragging";
import { IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { Item } from "definitions/items/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import { TextManager } from "utils/textManager";
import "./css/adventurerinfo.css";
import DraggableItemIcon, { InventoryItemDragInfo } from "./DraggableItemIcon";
import EquipmentSlot, { EquipmentSlotType } from "./EquipmentSlot";
import Inventory from "./inventory/Inventory";
import { TooltipManager } from 'global/TooltipManager';

export interface Props {
    adventurerId: string;
}

export interface DispatchProps {
    onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onRemoveItemFromInventory: (adventurerId: string, fromSlot: number) => void;
    onAssignEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType, item: Item) => void;
    onAddItemToInventory: (adventurerId: string, item: Item, toSlot: number) => void;
    onMoveItemFromWarehouseToInventory: (adventurerId: string, fromSlot: number, toSlot: number, item: Item, otherItem: Item|null) => void;
    onRemoveEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType) => void;
    onAddItemToWarehouse: (item: Item, toSlot: number) => void;
    onAssignEquipmentFromWarehouse: (adventurerId: string, fromSlot: number, item: Item, equipmentSlot: EquipmentSlotType) => void;
}

export interface StateProps {
    adventurer: AdventurerStoreState;
    warehouse: Array<Item|null>;
}

type AllProps = Props & DispatchProps & StateProps;

const AdventurerInfo = (props: AllProps) => {

    const adventurer = props.adventurer;
    const attributes = Object.keys(adventurer.stats).map((stat) => {
        const value: number = adventurer.stats[stat];
        return <div key={`${adventurer.id}-${stat}`} > <b>{stat}</b>: {value.toFixed(1)} </div>;
    });
    // const equipmentList = Object.keys(getEquipment(.map((equipment) =) {
    //     return <div key = { `${adventurer.id}-${equipment}` } ><b>{ equipment }</b>: { getEquipment(equipment] }  </di)>;
    // });

    const handleDropItemEquipment = (dragInfo: InventoryItemDragInfo, slotType: EquipmentSlotType) => {
        // When an item gets dropped on equipment slot
        const item = dragInfo.item;
        switch (dragInfo.sourceType) {
            case DragSourceType.adventurerInventory: {
                // Dragged from inventory
                props.onRemoveItemFromInventory(adventurer.id, dragInfo.inventorySlot!);
                props.onAssignEquipment(adventurer.id, slotType, item);

                const existingEquipment = adventurer.equipment[EquipmentSlotType[slotType]];
                if (existingEquipment) {
                    props.onAddItemToInventory(adventurer.id, existingEquipment, dragInfo.inventorySlot!);
                }
                break;
            }
            case DragSourceType.warehouse: {
                // Dragged from warehouse
                props.onAssignEquipmentFromWarehouse(adventurer.id, dragInfo.inventorySlot!, item, slotType);

                const existingEquipment = adventurer.equipment[EquipmentSlotType[slotType]];
                if (existingEquipment) {
                    props.onAddItemToWarehouse(existingEquipment, dragInfo.inventorySlot!);
                }
                break;
            }
            case DragSourceType.adventurerEquipment: {
                // Dragged from equipment slot (only applicable to weapons)
                props.onAssignEquipment(adventurer.id, slotType, item);

                const existingEquipment = adventurer.equipment[EquipmentSlotType[slotType]];
                const fromSlot = dragInfo.inventorySlot!;
                if (existingEquipment) {
                    // Another weapon was there, switch them
                    props.onAssignEquipment(adventurer.id, fromSlot, existingEquipment);
                } else {
                    // Clear the slot where it came from
                    props.onRemoveEquipment(adventurer.id, fromSlot);
                }
                break;
            }
        }
    };

    const getEquipmentSlot = (slotType: EquipmentSlotType) => {
        // returns EquipmentSlot
        const item: Item | undefined = adventurer.equipment[EquipmentSlotType[slotType]];
        let contents = null;
        if (item) {
            const itemRef: React.RefObject<any> = React.createRef();
            const handleClick = (event: React.MouseEvent) => {
                const origin = (event.currentTarget as HTMLElement);
                const originRect = origin.getBoundingClientRect();
                TooltipManager.showContextTooltip(ContextType.item, getDefinition(item), originRect);
                event.stopPropagation();
            };

            contents = (
                <DraggableItemIcon
                    index={slotType}
                    sourceId={adventurer.id}
                    sourceType={DragSourceType.adventurerEquipment}
                    item={item}
                    onClick={handleClick}
                    ref={itemRef}
                    size={IconSize.medium}
                />
            );
        }

        return (
            <>
                <EquipmentSlot
                    onDrop={(dragInfo: InventoryItemDragInfo) => handleDropItemEquipment(dragInfo, slotType)}
                    type={slotType}
                >
                    {contents}
                </EquipmentSlot>
                <span className="info">{TextManager.get(`ui-equipmentslot-${EquipmentSlotType[slotType]}`)}</span>
            </>
        );
    };

    const equipmentList = (
        <ul>
            <li>{getEquipmentSlot(EquipmentSlotType.head)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.shoulders)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.chest)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.hands)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.legs)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.feet)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.mainHand)}</li>
            <li>{getEquipmentSlot(EquipmentSlotType.offHand)}</li>
        </ul>
    );

    const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        switch (sourceType) {
            case DragSourceType.adventurerInventory:
                // Drag from one inventory slot to another
                if (props.onMoveItemInInventory) {
                    props.onMoveItemInInventory(adventurer.id, fromSlot, toSlot);
                }
                break;

            case DragSourceType.warehouse: {
                // Dragged from warehouse
                const otherItem = adventurer.inventory[toSlot];
                props.onMoveItemFromWarehouseToInventory(adventurer.id, fromSlot, toSlot, item, otherItem);
                break;
            }

            case DragSourceType.adventurerEquipment:
                // Drag from equipment slot
                if (props.onAddItemToInventory && props.onRemoveEquipment) {
                    props.onAddItemToInventory(adventurer.id, item, toSlot);
                }

                const existingEquipment = adventurer.inventory[toSlot];
                if (existingEquipment) {
                    // Was dropped on another piece of equipment in inventory, switch them
                    props.onAssignEquipment(adventurer.id, fromSlot, existingEquipment);
                } else {
                    // Clear the slot where it came from
                    props.onRemoveEquipment(adventurer.id, fromSlot);
                }
                break;
        }
    };
    return (
        <div className="adventurer-info">
            <div className="left">
                <div className="name">
                    <b>{adventurer.name}</b>
                </div>
                <div className="attributes">
                    {attributes}
                </div>
                <div className="equipment">
                    {equipmentList}
                </div>
            </div>
            <div className="right">
                <Inventory
                    sourceType={DragSourceType.adventurerInventory}
                    sourceId={adventurer.id}
                    items={adventurer.inventory}
                    onDropItem={handleDropItemInventory}
                />
            </div>
        </div>
    );
};

export default AdventurerInfo;
