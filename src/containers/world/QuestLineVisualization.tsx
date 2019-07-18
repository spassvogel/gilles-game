
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import QuestLineVisualization, { DispatchProps, Props, StateProps } from "components/world/QuestLineVisualization";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        // onSelectQuest: (quest: string) => {
        //     //dispatch(advanceQuest(quest));
        // },
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (QuestLineVisualization);
