
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { advanceQuest } from "src/actions/quests";
import RealWorldView,
    { DispatchProps, Props, StateProps } from "src/components/partyScreen/RealWorldView";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        quests: store.quests,
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
    (RealWorldView);
