import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { moveItemInInventory } from "src/actions/adventurers";
import AdventurersBox, { DispatchProps, Props, StateProps } from "src/components/AdventurersBox";
import { adventurersInParty } from "src/storeHelpers";
import { StoreState } from "src/stores";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {

    const { parties } = store;
    const groupedAdventurers = Object.keys(parties).reduce((acc, val: string) => {
        acc[val] = adventurersInParty(store, val);
        return acc;
    }, {});
    // TODO: reselect!
    return {
        groupedAdventurers,
        parties,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps => {
    return {
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (AdventurersBox);
