import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import SimpleLog, { DispatchProps, Props, StateProps } from "components/log/SimpleLog";
import { StoreState } from "stores";
import { QuestStatus } from "stores/quest";

const mapStateToProps = (store: StoreState): StateProps => {
    return {
        logEntries: store.log,
        questNames: store.quests.filter((q) => q.status === QuestStatus.active).map((q) => q.name),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (SimpleLog);
