import { assignEquipment, moveItemInInventory, removeItemFromInventory, addItemToInventory, removeEquipment } from "actions/adventurers";
import AdventurerInfo, { DispatchProps, Props, StateProps } from "components/ui/AdventurerInfo";
import { Props as WindowProps } from "components/ui/window/Window";
import { EquipmentType } from "definitions/items/equipment";
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

    const adventurer = store.adventurers.find(a => a.id === ownProps.adventurerId)!;
    return {
        adventurer
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
        onAssignEquipment: (adventurerId: string, type: EquipmentType, item: Item) => {
            const action = assignEquipment(adventurerId, type, item);
            dispatch(action);
        },
        // Moves item within an adventurers' inventory
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
        onRemoveEquipment: (adventurerId: string, type: EquipmentType) => {
            const action = removeEquipment(adventurerId, type);
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
