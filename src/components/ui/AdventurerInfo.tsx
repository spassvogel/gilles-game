import { DragSourceType } from "constants/dragging";
import { Item } from "definitions/items/types";
import * as React from "react";
import { AdventurerStoreState } from "stores/adventurer";
import "./css/adventurerinfo.css";
import Inventory from "./inventory/Inventory";
import EquipmentSlot from "./EquipmentSlot";
import { EquipmentType } from "definitions/items/equipment";

export interface Props {
    adventurer: AdventurerStoreState;
}

export interface DispatchProps {
    onMoveItemInInventory?: (adventurerId: string, fromSlot: number, toSlot: number) => void;
}

type AllProps = Props & DispatchProps;

const AdventurerInfo = (props: AllProps) => {
    const adventurer = props.adventurer;
    const attributes = Object.keys(adventurer.stats).map((stat) => {
        const value: number = adventurer.stats[stat];
        return <div key = { `${adventurer.id}-${stat}`} > <b>{ stat }</b>: { value.toFixed(1) } </div>;
    });
    // const equipmentList = Object.keys(adventurer.equipment).map((equipment) => {
    //     return <div key = { `${adventurer.id}-${equipment}` } ><b>{ equipment }</b>: { adventurer.equipment[equipment] }  </div>;
    // });

    const handleDropItemEquipment = (item: Item) => {
        console.log(item);
    };
    const equipmentList = <ul>
        <li><EquipmentSlot
            item = { null }
            onDrop = { handleDropItemEquipment }
            type = { EquipmentType.head }/>head
        </li>
        <li>shoulders</li>
        <li>chest</li>
        <li>hands</li>
        <li>legs</li>
        <li>feet</li>
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
                <Inventory sourceType = { DragSourceType.adventurer }
                    items = { adventurer.inventory }
                    onDropItem = { handleDropItemInventory }
                />
            </div>
        </div>
    );
};

export default AdventurerInfo;
