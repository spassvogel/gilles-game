import { connect } from "react-redux";
import Topbar, { StateProps } from "src/components/Topbar";
import { selectFreeWorkers } from "src/selectors/workers";
import { StoreState } from "../stores";

function mapStateToProps(store: StoreState): StateProps {
    return {
        gold: store.gold,
        workers: store.workers,
        workersFree: selectFreeWorkers(store),
    };
}

export default connect<StateProps>(mapStateToProps)(Topbar);
