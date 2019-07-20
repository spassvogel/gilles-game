import Topbar, { StateProps, Props } from "components/topbar/Topbar";
import { connect } from "react-redux";
import { StoreState } from "../stores";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import { withAppContext } from "hoc/withAppContext";

// todo this container might not be strictly necessary 
// also withRouter is probably not necessary
const mapStateToProps = (store: StoreState): StateProps => {
    return {
    };
}

export default compose(
    connect<StateProps, null, Props, StoreState>(mapStateToProps),    
    withRouter,
    withAppContext
)(Topbar) as React.ComponentType<Props>;