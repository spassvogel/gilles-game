import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { subtractGold } from "src/actions/gold";
import { decreaseWorkers, increaseWorkers, upgradeStructure } from "src/actions/structures";
import { selectFreeWorkers } from "src/selectors/workers";
import ResourceStructureView,  { DispatchProps, Props } from "../components/ResourceStructureView";
import { StoreState } from "../stores";
import { StructureStoreState } from "../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props) {
    const structureStore: StructureStoreState = store.structures[ownProps.type];
    if (!structureStore) { throw new Error(`No structure '${ownProps.type}' found in the store!`); }
    return {
        gold: store.gold,
        level: structureStore.level,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onUpgrade: (cost: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(ownProps.type)); // Todo: time??
        },
        onWorkersDown: () => {
            dispatch(decreaseWorkers(ownProps.type));
        },
        onWorkersUp: () => {
            dispatch(increaseWorkers(ownProps.type));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceStructureView);
