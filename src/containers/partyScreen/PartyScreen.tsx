
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { moveItemInInventory, moveItemToOtherAdventurer } from "src/actions/adventurers";
import PartyScreen, { DispatchProps, Props, StateProps } from "src/components/partyScreen/PartyScreen";
import { withAppContext } from "src/hoc/withAppContext";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        adventurers: store.adventurers,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
        onMoveItemToOtherAdventurer: (fromAdventurerId: string, fromSlot: number, toAdventurerId: string) => {
            const action = moveItemToOtherAdventurer(fromAdventurerId, fromSlot, toAdventurerId);
            dispatch(action);
        },
    };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(PartyScreen);