
import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import App, { DispatchProps, Props, StateProps } from "components/App";
import { StoreState } from "stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return { };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(App);
