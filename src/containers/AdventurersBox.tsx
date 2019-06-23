import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { addItemToInventory, moveItemInInventory } from "src/actions/adventurers";
import { removeItemFromWarehouse } from "src/actions/items";
import AdventurersBox, { DispatchProps, Props, StateProps } from "src/components/AdventurersBox";
import { Item } from "src/definitions/items/types";
import { selectAdventurersGroupedByQuest as selectAdventurersGroupedByQuest } from "src/selectors/adventurers";
import { StoreState } from "src/stores";

const mapStateToProps = (store: StoreState): StateProps => {

    return {
        groupedAdventurers: selectAdventurersGroupedByQuest(store),
        quests: store.quests,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        onMoveItemFromWarehouseToAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => {
            const removeAction = removeItemFromWarehouse(fromSlot);
            dispatch(removeAction);

            const addAction = addItemToInventory(adventurerId, item, toSlot);
            dispatch(addAction);
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
