import { AppContext } from "components/App";
import { ContextType } from "constants/context";
import { DragSourceType } from "constants/dragging";
import { IconSize } from "constants/icons";
import { getDefinition } from "definitions/items";
import { EquipmentType } from "definitions/items/equipment";
import { Item } from "definitions/items/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import "./css/adventurerinfo.css";
import DraggableItemIcon, { InventoryItemDragInfo } from "./DraggableItemIcon";
import EquipmentSlot from "./EquipmentSlot";
import Inventory from "./inventory/Inventory";

export interface Props {
    adventurerId: string;
}

export interface DispatchProps {
    onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onRemoveItemFromInventory: (adventurerId: string, fromSlot: number) => void;
    onAssignEquipment: (adventurerId: string, type: EquipmentType, item: Item) => void;
    onAddItemToInventory: (adventurerId: string, item: Item, toSlot: number) => void;
    onRemoveEquipment: (adventurerId: string, type: EquipmentType) => void;
}

export interface StateProps {
    adventurer: AdventurerStoreState;
}

type AllProps = Props & DispatchProps & StateProps;

const AdventurerInfo = (props: AllProps) => {

    const context = React.useContext(AppContext)!;
    const adventurer = props.adventurer;
    const attributes = Object.keys(adventurer.stats).map((stat) => {
        const value: number = adventurer.stats[stat];
        return <div key = { `${adventurer.id}-${stat}`} > <b>{ stat }</b>: { value.toFixed(1) } </div>;
    });
    // const equipmentList = Object.keys(getEquipment(.map((equipment) =) {
    //     return <div key = { `${adventurer.id}-${equipment}` } ><b>{ equipment }</b>: { getEquipment(equipment] }  </di)>;
    // });

    const handleDropItemEquipment = (type: EquipmentType, dragInfo: InventoryItemDragInfo) => {
        // When an item gets dropped on equipment slot
        const item = dragInfo.item;
        props.onRemoveItemFromInventory(adventurer.id, dragInfo.inventorySlot!);
        props.onAssignEquipment(adventurer.id, type, item);

        const existingEquipment = adventurer.equipment[EquipmentType[type]];
        if (existingEquipment) {
            props.onAddItemToInventory(adventurer.id, existingEquipment, dragInfo.inventorySlot!);
        }
    };

    const getEquipmentSlot = (type: EquipmentType) => {
        // returns EquipmentSlot
        const item: Item | undefined = adventurer.equipment[EquipmentType[type]];
        let contents = null;

        if (item) {
            const itemRef: React.RefObject<any> = React.createRef();
            const handleClick = (event: React.MouseEvent) => {
                const origin = (event.currentTarget as HTMLElement);
                const originRect = origin.getBoundingClientRect();
                context.onContextualObjectActivated(
                    ContextType.item,
                    getDefinition(item),
                    itemRef,
                    originRect,
                );
                event.stopPropagation();
            };

            contents = <DraggableItemIcon
                index = { type }
                sourceId = { adventurer.id }
                sourceType = { DragSourceType.adventurerEquipment }
                item = { item }
                onClick = { handleClick }
                ref = { itemRef }
                size = { IconSize.medium }
            >
            </DraggableItemIcon>;
        }

        return <EquipmentSlot
            onDrop = { (dragInfo: InventoryItemDragInfo) => handleDropItemEquipment(type, dragInfo) }
            type = { type }>
                { contents }
        </EquipmentSlot>;
    };

    const equipmentList = <ul>
        <li>
            { getEquipmentSlot(EquipmentType.head) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.shoulders) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.chest) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.hands) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.legs) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.feet) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.weapon) }
        </li>
        <li>
            { getEquipmentSlot(EquipmentType.weapon) }
        </li>
    </ul>;

    const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        switch (sourceType) {
            case DragSourceType.adventurerInventory:
                // Drag from one inventory slot to another
                if (props.onMoveItemInInventory) {
                    props.onMoveItemInInventory(adventurer.id, fromSlot, toSlot);
                }
                break;

            case DragSourceType.adventurerEquipment:
                // Drag from equipment slot
                if (props.onAddItemToInventory && props.onRemoveEquipment) {
                    props.onAddItemToInventory(adventurer.id, item, toSlot);
                    props.onRemoveEquipment(adventurer.id, fromSlot);
                }
                break;
        }
    };
    return (
        <div className = "adventurer-info">
            <div className = "left">
                <div className = "name">
                    <b>{ adventurer.name }</b>
                </div>
                <div className = "attributes">
                    { attributes }
                </div>
                <div className = "equipment">
                    { equipmentList }
                </div>
            </div>
            <div className = "right">
                <Inventory
                    sourceType = { DragSourceType.adventurerInventory }
                    sourceId = { adventurer.id }
                    items = { adventurer.inventory }
                    onDropItem = { handleDropItemInventory }
                />
            </div>
        </div>
    );
};

export default AdventurerInfo;
