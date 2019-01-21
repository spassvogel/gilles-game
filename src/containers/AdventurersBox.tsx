import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { addItemToInventory, moveItemInInventory } from "src/actions/adventurers";
import { removeItemFromWarehouse } from "src/actions/items";
import AdventurersBox, { DispatchProps, Props, StateProps } from "src/components/AdventurersBox";
import { Item } from "src/definitions/items/types";
import { selectAdventurersGroupedByParty } from "src/selectors/adventurers";
import { StoreState } from "src/stores";

const mapStateToProps = (store: StoreState): StateProps => {

    return {
        groupedAdventurers: selectAdventurersGroupedByParty(store),
        parties: store.parties,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        onMoveItemFromWarehouseToAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => {
            const action1 = removeItemFromWarehouse(fromSlot);
            dispatch(action1);

            const action2 = addItemToInventory(adventurerId, item, toSlot);
            dispatch(action2);
        },
        // Moves item within an adventurers' inventory
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (AdventurersBox);
