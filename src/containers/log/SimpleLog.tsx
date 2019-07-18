import SimpleLog, { DispatchProps, Props, StateProps } from "components/log/SimpleLog";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { selectActiveQuests } from "selectors/quests";
import { StoreState } from "stores";

const mapStateToProps = (store: StoreState): StateProps => {
    return {
        logEntries: store.log,
        questNames: selectActiveQuests(store),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(SimpleLog);
