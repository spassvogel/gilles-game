import { assignEquipment, moveItemInInventory, removeItemFromInventory } from "actions/adventurers";
import AdventurerInfo, { DispatchProps, Props } from "components/ui/AdventurerInfo";
import { EquipmentType } from "definitions/items/equipment";
import { Item } from "definitions/items/types";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";

// todo: perhaps not use container, just pass dispatch callbacks as props?
const mapStateToProps = (store: StoreState) => {

    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
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
        // Removes an item from an adventurers' inventory
        onRemoveItemFromInventory: (adventurerId: string, fromSlot) => {
            const action = removeItemFromInventory(adventurerId, fromSlot);
            dispatch(action);
        },
    };
};

export default connect<object, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(AdventurerInfo);
