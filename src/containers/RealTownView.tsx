
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import RealTownView, { DispatchProps, Props, StateProps } from "src/components/RealTownView";
import { withAppContext } from "src/hoc/withAppContext";
import { StoreState } from "src/stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const tasks = store.tasks.running.filter((val) => val.origin === `town`);
    return {
        structures: store.structures,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return { };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(RealTownView);
