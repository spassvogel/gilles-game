import { addItemToInventory, assignEquipment, moveItemInInventory, removeEquipment, removeItemFromInventory } from "actions/adventurers";
import { addItemToWarehouse, removeItemFromWarehouse } from "actions/items";
import AdventurerInfo, { DispatchProps, Props, StateProps } from "components/ui/AdventurerInfo";
import { EquipmentSlotType } from "components/ui/EquipmentSlot";
import { Item } from "definitions/items/types";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";

// todo: perhaps not use container, just pass dispatch callbacks as props?
const mapStateToProps = (store: StoreState, ownProps: Props) => {

    const adventurer = store.adventurers.find((a) => a.id === ownProps.adventurerId)!;
    return {
        adventurer,
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        // Adds item to inventory of adventurer
        onAddItemToInventory: (adventurerId: string, item: Item, toSlot: number) => {
            const action = addItemToInventory(adventurerId, item, toSlot);
            dispatch(action);
        },
        // Adds item to warehouse
        onAddItemToWarehouse: (item: Item, toSlot: number) => {
            const add = addItemToWarehouse(item, toSlot);
            dispatch(add);
        },
        // Equipment gets assigned to a slot
        onAssignEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType, item: Item) => {
            const action = assignEquipment(adventurerId, equipmentSlot, item);
            dispatch(action);
        },
        // Assigns an equipment from the warehouse directly to an adventurer equipment slot
        onAssignEquipmentFromWarehouse: (adventurerId: string, fromSlot: number, item: Item, equipmentSlot: EquipmentSlotType) => {
            const remove = removeItemFromWarehouse(fromSlot);
            dispatch(remove);

            const assign = assignEquipment(adventurerId, equipmentSlot, item);
            dispatch(assign);
        },
        // Moves item within an adventurers' inventory
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
        onRemoveEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType) => {
            const action = removeEquipment(adventurerId, equipmentSlot);
            dispatch(action);
        },
        // Removes an item from an adventurers' inventory
        onRemoveItemFromInventory: (adventurerId: string, fromSlot: number) => {
            const action = removeItemFromInventory(adventurerId, fromSlot);
            dispatch(action);
        },
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(AdventurerInfo);
