import { removeItemFromInventory } from "actions/adventurers";
import { subtractGold } from "actions/gold";
import { addItemToWarehouse, moveItemInWarehouse } from "actions/items";
import { addLogEntry } from "actions/log";
import { upgradeStructure } from "actions/structures";
import WarehouseStructureView,
    { DispatchProps, Props, StateProps } from "components/structures/warehouse/WarehouseStructureView";
import { Item } from "definitions/items/types";
import structureDefinitions, { Structure } from "definitions/structures";
import { WarehouseStructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import { withAppContext } from "hoc/withAppContext";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { selectFreeWorkers } from "selectors/workers";
import { LogChannel } from "stores/logEntry";
import { StoreState } from "../../../stores";
import { StructureStoreState } from "../../../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[Structure.warehouse];
    const structureDefinition = structureDefinitions[Structure.warehouse] as WarehouseStructureDefinition;
    const level: number = structureStore.level;
    const levelDefinition: WarehouseStructureLevelDefinition = structureDefinition.levels[level];

    if (!structureStore) { throw new Error(`No structure '${Structure.warehouse}' found in the store!`); }
    return {
        gold: store.gold,
        items: store.items,
        level,
        maxResources: levelDefinition.maxResources,
        resources: store.resources,
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
        onUpgrade: (cost: number, level: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(Structure.warehouse)); // Todo: [07/07/2019] time??

            level++;
            dispatch(addLogEntry("log-town-upgrade-structure-complete", {
                level,
                structure: Structure.warehouse,
            }, LogChannel.town));
        },
    };
}

// export default compose(
//     connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
// //    withAppContext,
// )(WarehouseStructureView) as React.ComponentType<Props>;

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(WarehouseStructureView);
