import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import SimpleLog, { DispatchProps, Props, StateProps } from "src/components/log/SimpleLog";
import { StoreState } from "src/stores";

const mapStateToProps = (store: StoreState): StateProps => {
    return {
        logEntries: store.log,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (SimpleLog);
