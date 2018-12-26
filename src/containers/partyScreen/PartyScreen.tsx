
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { moveItemInInventory, moveItemToOtherAdventurer } from "src/actions/adventurers";
import { updateEncounterResult, updateQuestVars } from "src/actions/quests";
import PartyScreen, { DispatchProps, Props, StateProps } from "src/components/partyScreen/PartyScreen";
import { withAppContext } from "src/hoc/withAppContext";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        adventurers: store.adventurers,
        store,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onDispatch: dispatch,
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
        onMoveItemToOtherAdventurer: (fromAdventurerId: string, fromSlot: number, toAdventurerId: string) => {
            const action = moveItemToOtherAdventurer(fromAdventurerId, fromSlot, toAdventurerId);
            dispatch(action);
        },
        onUpdateEncounterResult: (nodeIndex: number, result: string) => {
            const action = updateEncounterResult(ownProps.quest.name, nodeIndex, result);
            dispatch(action);
        },
    };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(PartyScreen);
