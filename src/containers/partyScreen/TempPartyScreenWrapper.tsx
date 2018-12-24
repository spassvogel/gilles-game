
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { advanceQuest } from "src/actions/quests";
import TempPartyScreenWrapper,
    { DispatchProps, Props, StateProps } from "src/components/partyScreen/TempPartyScreenWrapper";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        quest: store.activeQuests[0],
        store,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onAdvanceQuest: (quest: string) => {
            dispatch(advanceQuest(quest));
        },
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (TempPartyScreenWrapper);
