import * as React from "react";
import { Equipment } from "src/definitions/equipment/types";
import structureDefinitions, {  Structure  } from "src/definitions/structures";
import { StructureDefinition, StructureLevelDefinition } from "src/definitions/structures/types";
import { EquipmentStoreState } from "src/stores/equipment";
import "./css/warehousestructureview.css";
import EquipmentIcon, { InventoryItemDragInfo } from "./partyScreen/EquipmentIcon";
import InventorySlot from "./partyScreen/InventorySlot";

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {

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
}

export default function(props: Props & DispatchProps & StateProps ) {

    const structureDefinition = structureDefinitions[props.type] as StructureDefinition;
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type} with type StructureDefinition.`);
    }
    const level: number = props.level;
    const levelDefinition: StructureLevelDefinition = structureDefinition.levels[level];

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
            const slot = <InventorySlot
                key= { `inventory-slot-${i}`}
                empty = { false }
                onDrop= { handleDrop }>
                    <EquipmentIcon
                        index = {i}
                        key = { `inventory-slot-${i}`}
                        source = "warehouse"
                        item = { equipment as Equipment}>
                    </EquipmentIcon>;
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
            onDrop= { handleDrop }>
        </InventorySlot>;
        inventory.push(slot);
        i++;
    }
    return (
        <details open = { true } className = "warehouse-structureview">
            <summary>{ levelDefinition.displayName }</summary>
            <section className = "inventory">
                { inventory }
            </section>
        </details>
    );
}
