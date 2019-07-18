
import RealTownView, { DispatchProps, Props, StateProps } from "components/RealTownView";
import { withAppContext } from "hoc/withAppContext";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { StoreState } from "stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
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
)(RealTownView) as React.ComponentType<Props>;
