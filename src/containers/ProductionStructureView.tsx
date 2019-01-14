import ProductionStructureView,
    { DispatchProps, Props, StateProps } from "../components/structures/ProductionStructureView";

import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { subtractGold } from "src/actions/gold";
import { addItem } from "src/actions/items";
import { removeResources } from "src/actions/resources";
import { upgradeStructure } from "src/actions/structures";
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
        workersFree: selectFreeWorkers(store),
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onCraft: (productionDefinition: ProductionDefinition) => {
            const callback = addItem(productionDefinition.item);
            dispatch(removeResources(productionDefinition.cost));
            const start = startTask(TaskType.craftItem,
                productionDefinition.item,
                `${ownProps.type}.craft`,
                productionDefinition.time,
                callback);
            dispatch(start);
        },
        onUpgrade: (cost: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(ownProps.type)); // TODO: time to upgarde??
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductionStructureView);
