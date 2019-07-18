import Topbar, { StateProps } from "components/Topbar";
import { connect } from "react-redux";
import { selectFreeWorkers } from "selectors/workers";
import { StoreState } from "../stores";

function mapStateToProps(store: StoreState): StateProps {
    return {
        gold: store.gold,
        workers: store.workers,
        workersFree: selectFreeWorkers(store),
    };
}

export default connect<StateProps, null, null, StoreState>(mapStateToProps)(Topbar);
