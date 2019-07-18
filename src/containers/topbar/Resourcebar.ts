import Resourcebar, { Props, StateProps } from "components/topbar/Resourcebar";
import { connect } from "react-redux";
import { selectFreeWorkers } from "selectors/workers";
import { StoreState } from "stores";

const mapStateToProps = (store: StoreState): StateProps => {

    return {
        gold: store.gold,
        resources: store.resources,
        workers: store.workers,
        workersFree: selectFreeWorkers(store),
    };
};

// const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
//     return {
//     };
// };

export default connect<StateProps, null, Props, StoreState>(mapStateToProps)(Resourcebar);
