import * as React from "react";
import { DragSourceType } from "src/constants";
import ResourceViewRow from "src/containers/ResourceViewRow";
import { Item } from "src/definitions/items/types";
import { Resource } from "src/definitions/resources";
import structureDefinitions, {  Structure  } from "src/definitions/structures";
import { StructureDefinition, StructureLevelDefinition } from "src/definitions/structures/types";
import { AppContextProps } from "../App";
import Inventory from "../ui/inventory/Inventory";
import "./css/warehousestructureview.css";

export interface DispatchProps {
    onMoveItemInWarehouse: (fromSlot: number, toSlot: number) => void;
    onMoveItemFromAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => void;
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

const warehouse = DragSourceType.warehouse;
const WarehouseStructureView = (props: AllProps) => {

    const structureDefinition = structureDefinitions[props.type] as StructureDefinition;
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type} with type StructureDefinition.`);
    }
    const level: number = props.level;
    const levelDefinition: StructureLevelDefinition = structureDefinition.levels[level];
    const handleDropItem = (item: Item, fromSlot: number,
                            toSlot: number, sourceType: DragSourceType, sourceId?: string): void => {
        switch (sourceType) {
            case warehouse:
                if (props.onMoveItemInWarehouse) {
                    props.onMoveItemInWarehouse(fromSlot, toSlot);
                }
                break;
            case DragSourceType.adventurer:
                if (props.onMoveItemFromAdventurer) {
                    props.onMoveItemFromAdventurer(sourceId!, item, fromSlot, toSlot);
                }
                break;
        }
    };
    return (
        <details open = { true } className = "warehouse-structureview">
            <summary>{ levelDefinition.displayName }</summary>
            <fieldset className="resources">
                <legend>Resources</legend>
                <ResourceViewRow type = { Resource.wood }/>
                <ResourceViewRow type = { Resource.iron }/>
                <ResourceViewRow type = { Resource.food }/>
                <ResourceViewRow type = { Resource.stone }/>
                <ResourceViewRow type = { Resource.fabric }/>
                <ResourceViewRow type = { Resource.leather }/>
            </fieldset>

            <Inventory
                sourceType={warehouse}
                items={props.items}
                onDropItem={handleDropItem}
            />
        </details>
    );
};
export default WarehouseStructureView;
