import * as React from "react";
import { Item } from "src/definitions/items/types";
import structureDefinitions, {  Structure  } from "src/definitions/structures";
import { StructureDefinition, StructureLevelDefinition } from "src/definitions/structures/types";
import { EquipmentStoreState } from "src/stores/equipment";
import { AppContextProps } from "../App";
import Inventory from "../ui/inventory/Inventory";
import "./css/warehousestructureview.css";

export interface DispatchProps {
    onMoveItemInWarehouse: (fromSlot: number, toSlot: number) => void;
}

export interface Props  {
    type: Structure;
}

export interface StateProps  {
    level: number;
    workers: number;
    workersFree: number;
    gold: number;
    equipment: EquipmentStoreState;
    items: Array<Item|null>;
}

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

const WarehouseStructureView = (props: AllProps) => {

    const structureDefinition = structureDefinitions[props.type] as StructureDefinition;
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type} with type StructureDefinition.`);
    }
    const level: number = props.level;
    const levelDefinition: StructureLevelDefinition = structureDefinition.levels[level];
    /*
    // Todo REFACTOR to Items
    const inventory: Array<React.ReactElement<any>> = [];
    let i = 0;
    Object.keys(props.equipment).forEach((equipment) => {
        for (let j = 0; j < props.equipment[equipment]; j++) {
            const handleDrop = (dragInfo: InventoryItemDragInfo) => {
                if (dragInfo.inventorySlot === i) {
                    return;
                }

                // if (this.props.onMoveItemInInventory) {
                //     const { inventorySlot: fromSlot} = dragInfo;
                //     this.props.onMoveItemInInventory(adventurer.id, fromSlot!, i);
                // }
            };
            const handleClick = () => {
                props.onContextualObjectActivated(
                    ContextType.item,
                    itemDefinitions[equipment],
                );
            };
            const slot = <InventorySlot
                key= { `inventory-slot-${i}`}
                empty = { false }
                onDrop= { handleDrop }>
                    <ItemIcon
                        index = {i}
                        key = { `inventory-slot-${i}`}
                        source = "warehouse"
                        onClick = { handleClick }
                        item = { equipment as Item}>
                    </ItemIcon>
                </InventorySlot>;
            inventory.push(slot);
            i++;
        }
    });

    // Make a row of at least 4
    const emptySlotsToAdd = 4 - (i % 4);
    for (let j = 0; j < emptySlotsToAdd; j++) {
        const handleDrop = (dragInfo: InventoryItemDragInfo) => {
            if (dragInfo.inventorySlot === i) {
                return;
            }

            // if (this.props.onMoveItemInInventory) {
            //     const { inventorySlot: fromSlot} = dragInfo;
            //     this.props.onMoveItemInInventory(adventurer.id, fromSlot!, i);
            // }
        };
        const slot = <InventorySlot
            key= { `inventory-slot-${i}`}
            empty = { true }
            onDrop= { handleDrop }
        ></InventorySlot>;
        inventory.push(slot);
        i++;
    }*/

    const handleMoveItem = (fromSlot: number, toSlot: number): void => {
        if (props.onMoveItemInWarehouse) {
            props.onMoveItemInWarehouse(fromSlot, toSlot);
        }
    };
    return (
        <details open = { true } className = "warehouse-structureview">
            <summary>{ levelDefinition.displayName }</summary>
            <Inventory
                source="warehouse"
                items={ props.items }
                onMoveItem={ handleMoveItem }
            />
        </details>
    );
};
export default WarehouseStructureView;