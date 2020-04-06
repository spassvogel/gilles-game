// todo: obsolete
import { moveItemInInventory, moveItemToOtherAdventurer } from "actions/adventurers";
import { updateEncounterResult } from "actions/quests";
import { advanceQuest } from "actions/quests";
import { Props as WindowProps } from "components/ui/window/Window";
import PartyWindow, { DispatchProps, Props, StateProps } from "components/ui/window/windows/PartyWindow";
import { withWindow } from "hoc/withWindow";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { selectLastQuestLogEntry } from "selectors/quests";
import { adventurersOnQuest } from "storeHelpers";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const adventurers = adventurersOnQuest(store.adventurers, ownProps.quest);
    const lastLog = selectLastQuestLogEntry(store, ownProps.quest.name);
    return {
        adventurers,
        lastLog,
        store, // needed for the oracle, causes update all the time :/
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onAdvanceQuest: (quest: string) => {
            dispatch(advanceQuest(quest));
        },
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
    withWindow,
)(PartyWindow) as React.ComponentType<Props & WindowProps>;
