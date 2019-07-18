import Topbar, { StateProps } from "components/topbar/Topbar";
import { connect } from "react-redux";
import { selectFreeWorkers } from "selectors/workers";
import { StoreState } from "../stores";

function mapStateToProps(store: StoreState): StateProps {
    return {
    };
}

export default connect<StateProps, null, null, StoreState>(mapStateToProps)(Topbar);
