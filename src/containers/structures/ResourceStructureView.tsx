import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { subtractGold } from "src/actions/gold";
import { addLogEntry } from "src/actions/log";
import { decreaseWorkers, increaseWorkers, upgradeStructure } from "src/actions/structures";
import { selectFreeWorkers } from "src/selectors/workers";
import { LogChannel } from "src/stores/logEntry";
import ResourceStructureView,  { DispatchProps, Props, StateProps } from "../../components/structures/ResourceStructureView";
import { StoreState } from "../../stores";
import { StructureStoreState } from "../../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
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
        onUpgrade: (cost: number, level: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(ownProps.type)); // Todo: [07/07/2019] time??

            level++;
            dispatch(addLogEntry("log-town-upgrade-structure-complete", LogChannel.town, {
                level,
                structure: ownProps.type,
            }));
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
