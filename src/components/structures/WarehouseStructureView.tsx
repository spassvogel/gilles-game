import * as React from "react";
import { Item } from "src/definitions/items/types";
import structureDefinitions, {  Structure  } from "src/definitions/structures";
import { StructureDefinition, StructureLevelDefinition } from "src/definitions/structures/types";
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
