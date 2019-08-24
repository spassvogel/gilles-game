import { addItemToInventory, assignEquipment, moveItemInInventory, removeEquipment, removeItemFromInventory } from "actions/adventurers";
import AdventurerInfo, { DispatchProps, Props, StateProps } from "components/ui/AdventurerInfo";
import { EquipmentSlotType } from "components/ui/EquipmentSlot";
import { Props as WindowProps } from "components/ui/window/Window";
import { Item } from "definitions/items/types";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";

type AllProps = Props & WindowProps;

// todo: perhaps not use container, just pass dispatch callbacks as props?
const mapStateToProps = (store: StoreState, ownProps: Props) => {

    const adventurer = store.adventurers.find((a) => a.id === ownProps.adventurerId)!;
    return {
        adventurer,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        // Adds item to inventory of adventurer
        onAddItemToInventory: (adventurerId: string, item: Item, toSlot: number) => {
            const action = addItemToInventory(adventurerId, item, toSlot);
            dispatch(action);
        },
        // Equipment gets assigned to a slot
        onAssignEquipment: (adventurerId: string, equipmentSlot: EquipmentSlotType, item: Item) => {
            const action = assignEquipment(adventurerId, equipmentSlot, item);
            dispatch(action);
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
        onRemoveItemFromInventory: (adventurerId: string, fromSlot) => {
            const action = removeItemFromInventory(adventurerId, fromSlot);
            dispatch(action);
        },
    };
};

export default compose(
    withWindow,
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
)(AdventurerInfo) as React.ComponentType<AllProps>;
