import ProductionStructureView,
    { DispatchProps, Props, StateProps } from "../../components/structures/ProductionStructureView";

import { subtractGold } from "actions/gold";
import { addItemToWarehouse } from "actions/items";
import { addLogEntry } from "actions/log";
import { removeResources } from "actions/resources";
import { decreaseWorkers, increaseWorkers, upgradeStructure } from "actions/structures";
import { startTask } from "actions/tasks";
import { ProductionDefinition } from "definitions/production/types";
import { withAppContext } from "hoc/withAppContext";
import { calculateProductionTime } from "mechanics/crafting";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { selectFreeWorkers } from "selectors/workers";
import { LogChannel } from "stores/logEntry";
import { TaskType } from "stores/task";
import { StoreState } from "../../stores";
import { StructureStoreState } from "../../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[ownProps.type];

    const tasks = store.tasks.running.filter((val) => val.origin === `${ownProps.type}.craft`);
    return {
        gold: store.gold,
        items: store.items,
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
            dispatch(addLogEntry("log-town-upgrade-structure-complete", {
                level,
                structure: ownProps.type,
            }, LogChannel.town));
        },
    };
}

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(ProductionStructureView) as React.ComponentType<Props>;
