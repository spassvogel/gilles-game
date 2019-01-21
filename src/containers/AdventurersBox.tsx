import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { addItemToInventory, moveItemInInventory } from "src/actions/adventurers";
import { removeItemFromWarehouse } from "src/actions/items";
import AdventurersBox, { DispatchProps, Props, StateProps } from "src/components/AdventurersBox";
import { Item } from "src/definitions/items/types";
import { adventurersInParty } from "src/storeHelpers";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {

    const { parties } = store;
    const foundInParty: AdventurerStoreState[] = []; // store the adventurers in parties in a temp array
    const groupedAdventurers = Object.keys(parties).reduce((acc, val: string) => {
        acc[val] = adventurersInParty(store, val);
        foundInParty.push(...acc[val]);
        return acc;
    }, {});
    const soloKey = "solo";
    groupedAdventurers[soloKey] = store.adventurers.filter((a) => foundInParty.indexOf(a) === -1);
    // TODO: reselect!
    return {
        groupedAdventurers,
        parties,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps => {
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
