import { addItemToInventory, moveItemInInventory, removeItemFromInventory } from "actions/adventurers";
import { subtractGold } from "actions/gold";
import { addItemToWarehouse, moveItemInWarehouse, removeItemFromWarehouse } from "actions/items";
import { addLogEntry } from "actions/log";
import { upgradeStructure } from "actions/structures";
import WarehouseStructureView,
    { DispatchProps, Props, StateProps } from "components/structures/warehouse/WarehouseStructureView";
import { Item } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import { WarehouseStructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { selectAdventurersInTown } from "selectors/adventurers";
import { selectFreeWorkers } from "selectors/workers";
import { StoreState } from "stores";
import { LogChannel } from "stores/logEntry";
import { StructureStoreState } from "stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[Structure.warehouse];
    const structureDefinition = getDefinition<WarehouseStructureDefinition>(Structure.warehouse);
    const level: number = structureStore.level;
    const levelDefinition: WarehouseStructureLevelDefinition = structureDefinition.levels[level];
    const adventurersInTown = selectAdventurersInTown(store);   // todo: refreshes too much. fix

    if (!structureStore) { throw new Error(`No structure '${Structure.warehouse}' found in the store!`); }
    return {
        adventurersInTown,
        gold: store.gold,
        items: store.items,
        level,
        maxResources: levelDefinition.maxResources,
        resources: store.resources,
        structures: store.structures,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onMoveItemFromAdventurer(adventurerId: string, item: Item, fromSlot: number, toSlot: number, otherItem: Item|null) {
            const remove = removeItemFromInventory(adventurerId, fromSlot);
            dispatch(remove);

            const add = addItemToWarehouse(item, toSlot);
            dispatch(add);

            if (otherItem) {
                const switchItem = addItemToInventory(adventurerId, otherItem, fromSlot);
                dispatch(switchItem);
            }
        },
        onMoveItemInWarehouse(fromSlot: number, toSlot: number) {
            dispatch(moveItemInWarehouse(fromSlot, toSlot));
        },
        // Moves item within an adventurers' inventory
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
        // Moves item from warehouse to an adventurer
        onMoveItemToAdventurer: (adventurerId: string, item: Item, fromSlot: number, toSlot: number) => {
            const remove = removeItemFromWarehouse(fromSlot);
            dispatch(remove);

            const add = addItemToInventory(adventurerId, item, toSlot);
            dispatch(add);
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
