import { AppContext } from "components/App";
import { ContextType } from "constants/context";
import { DragSourceType } from "constants/dragging";
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
    adventurer: AdventurerStoreState;
}

export interface DispatchProps {
    onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => void;
    onRemoveItemFromInventory: (adventurerId: string, fromSlot: number) => void;
    onAssignEquipment: (adventurerId: string, type: EquipmentType, item: Item) => void;
}

type AllProps = Props & DispatchProps;

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
        const item = dragInfo.item;
        props.onRemoveItemFromInventory(adventurer.id, dragInfo.inventorySlot!);
        props.onAssignEquipment(adventurer.id, type, item);
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
    </ul>;

    const handleDropItemInventory = (item: Item, fromSlot: number, toSlot: number): void => {
        // TODO: what if the source is NOT adventurer?
        if (props.onMoveItemInInventory) {
            props.onMoveItemInInventory(adventurer.id, fromSlot, toSlot);
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
