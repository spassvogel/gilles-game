import RealWorldView,
    { DispatchProps, Props, StateProps } from "components/partyScreen/RealWorldView";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        quests: store.quests,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onAdvanceQuest: (quest: string) => {
        },
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(RealWorldView);
