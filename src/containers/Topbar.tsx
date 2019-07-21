import Topbar, { Props, StateProps } from "components/topbar/Topbar";
import { withAppContext } from "hoc/withAppContext";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { StoreState } from "../stores";

// todo this container might not be strictly necessary
// also withRouter is probably not necessary
const mapStateToProps = (store: StoreState): StateProps => {
    return {
    };
};

export default compose(
    connect<StateProps, null, Props, StoreState>(mapStateToProps),
    withRouter,
    withAppContext,
)(Topbar) as React.ComponentType<Props>;
