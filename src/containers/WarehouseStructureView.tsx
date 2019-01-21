import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { addItemToInventory, removeItemFromInventory } from "src/actions/adventurers";
import { moveItemInWarehouse, removeItemFromWarehouse, addItemToWarehouse } from "src/actions/items";
import WarehouseStructureView,
    { DispatchProps, Props, StateProps } from "src/components/structures/WarehouseStructureView";
import { Item } from "src/definitions/items/types";
import { withAppContext } from "src/hoc/withAppContext";
import { selectFreeWorkers } from "src/selectors/workers";
import { StoreState } from "../stores";
import { StructureStoreState } from "../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[ownProps.type];
    if (!structureStore) { throw new Error(`No structure '${ownProps.type}' found in the store!`); }
    return {
        gold: store.gold,
        items: store.items,
        level: structureStore.level,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onMoveItemFromAdventurer(adventurerId: string, item: Item, fromSlot: number, toSlot: number) {
            const action1 = removeItemFromInventory(adventurerId, fromSlot);
            dispatch(action1);

            const action2 = addItemToWarehouse(item, toSlot);
            dispatch(action2);
        },
        onMoveItemInWarehouse(fromSlot: number, toSlot: number) {
            dispatch(moveItemInWarehouse(fromSlot, toSlot));
        },
    };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(WarehouseStructureView);
