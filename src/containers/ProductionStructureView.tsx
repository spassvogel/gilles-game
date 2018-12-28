import ProductionStructureView,  { DispatchProps, Props, StateProps } from "../components/ProductionStructureView";

import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { addEquipment } from "src/actions/equipment";
import { subtractGold } from "src/actions/gold";
import { removeResources } from "src/actions/resources";
import { decreaseWorkers, increaseWorkers, upgradeStructure } from "src/actions/structures";
import { startTask } from "src/actions/tasks";
import { ProductionDefinition } from "src/definitions/production/types";
import { selectFreeWorkers } from "src/selectors/workers";
import { TaskType } from "src/stores/task";
import { StoreState } from "../stores";
import { StructureStoreState } from "../stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[ownProps.type];

    const tasks = store.tasks.running.filter((val) => val.origin === `${ownProps.type}.craft`);
    return {
        gold: store.gold,
        level: structureStore.level,
        resources: store.resources,
        tasks,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onCraft: (productionDefinition: ProductionDefinition) => {
            const callback = addEquipment(productionDefinition.equipment);
            dispatch(removeResources(productionDefinition.cost));
            const start = startTask(TaskType.craftEquipment,
                productionDefinition.equipment,
                `${ownProps.type}.craft`,
                productionDefinition.time,
                callback);
            dispatch(start);
        },
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductionStructureView);
