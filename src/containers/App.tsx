
import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import App, { DispatchProps, Props, StateProps } from "src/components/App";
import { StoreState } from "src/stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return { };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        // onCheatGold: (amount: number) => dispatch(addGold(amount)),
        // onCheatResources: (amount: ResourceStoreState) => dispatch(addResources(amount)),
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(App);
