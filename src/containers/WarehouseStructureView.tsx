import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { moveItemInWarehouse } from "src/actions/items";
import WarehouseStructureView,
    { DispatchProps, Props, StateProps } from "src/components/structures/WarehouseStructureView";
import { withAppContext } from "src/hoc/withAppContext";
import { selectFreeWorkers } from "src/selectors/workers";
import { StoreState } from "../stores";
import { StructureStoreState } from "../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[ownProps.type];
    if (!structureStore) { throw new Error(`No structure '${ownProps.type}' found in the store!`); }
    return {
        equipment: store.equipment,
        gold: store.gold,
        items: store.items,
        level: structureStore.level,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onMoveItemInWarehouse(fromSlot: number, toSlot: number) {
            dispatch(moveItemInWarehouse(fromSlot, toSlot));
        },
    };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(WarehouseStructureView);
