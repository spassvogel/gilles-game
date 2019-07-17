import ProductionStructureView,
    { DispatchProps, Props, StateProps } from "../../components/structures/ProductionStructureView";

import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { subtractGold } from "src/actions/gold";
import { addItemToWarehouse } from "src/actions/items";
import { addLogEntry } from "src/actions/log";
import { removeResources } from "src/actions/resources";
import { decreaseWorkers, increaseWorkers, upgradeStructure } from "src/actions/structures";
import { startTask } from "src/actions/tasks";
import { Item } from "src/definitions/items/types";
import { ProductionDefinition } from "src/definitions/production/types";
import { withAppContext } from "src/hoc/withAppContext";
import { calculateProductionTime } from "src/mechanics/crafting";
import { selectFreeWorkers } from "src/selectors/workers";
import { LogChannel } from "src/stores/logEntry";
import { TaskType } from "src/stores/task";
import { StoreState } from "../../stores";
import { StructureStoreState } from "../../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[ownProps.type];

    const tasks = store.tasks.running.filter((val) => val.origin === `${ownProps.type}.craft`);
    const items: Item[] = [];
    store.items.forEach((i) => {
        // Creating a dense array. Typescript won't allow me to use .filter
        if (i !== null) {
            items.push(i);
        }
    });
    return {
        gold: store.gold,
        items,
        level: structureStore.level,
        resources: store.resources,
        tasks,
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onCraft: (productionDefinition: ProductionDefinition, workers: number) => {
            const craftingTime = calculateProductionTime(productionDefinition.cost.time || 0, workers);
            dispatch(removeResources(productionDefinition.cost.resources || {}));
            dispatch(increaseWorkers(ownProps.type, workers));

            const callbacks = [
                addItemToWarehouse(productionDefinition.item),
                decreaseWorkers(ownProps.type, workers),
            ];
            const start = startTask(TaskType.craftItem,
                productionDefinition.item,
                `${ownProps.type}.craft`,
                craftingTime,
                callbacks);
            dispatch(start);
        },
        onUpgrade: (cost: number, level: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(ownProps.type)); // TODO: [07/07/2019] time to upgarde??

            level++;
            dispatch(addLogEntry("log-town-upgrade-structure-complete", LogChannel.town, {
                level,
                structure: ownProps.type,
            }));
        },
    };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(ProductionStructureView);
