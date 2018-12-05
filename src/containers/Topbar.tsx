import { connect } from "react-redux";
import Topbar from "src/components/Topbar";
import { selectFreeWorkers } from "src/selectors/workers";
import { StoreState } from "../stores";

function mapStateToProps(store: StoreState) {
    return {
        gold: store.gold,
        workers: store.workers,
        workersFree: selectFreeWorkers(store),
    };
}

export default connect(mapStateToProps)(Topbar);
