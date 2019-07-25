import { advanceQuest } from "actions/quests";
import RealWorldView,
    { DispatchProps, Props, StateProps } from "components/partyScreen/RealWorldView";
import { withAppContext } from "hoc/withAppContext";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { StoreState } from "stores";

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

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(RealWorldView) as React.ComponentType<Props>;
