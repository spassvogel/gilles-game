import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction, compose } from "redux";
import TavernStructureView, { DispatchProps, Props, StateProps } from "src/components/structures/tavern/TavernStructureView";
import { Structure } from "src/definitions/structures";
import { withAppContext } from "src/hoc/withAppContext";
import { StoreState } from "src/stores";
import { QuestStatus } from "src/stores/quest";
import { StructureStoreState } from "src/stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[Structure.tavern];
    return {
        adventurers: store.adventurers,
        availableQuests: store.quests.filter((q) => q.status === QuestStatus.available ),
        level: structureStore.level,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        // onCraft: (productionDefinition: ProductionDefinition, workers: number) => {
        //     const craftingTime = calculateProductionTime(productionDefinition.time, workers);
        //     dispatch(removeResources(productionDefinition.cost));
        //     dispatch(increaseWorkers(ownProps.type, workers));

        //     const callbacks = [
        //         addItemToWarehouse(productionDefinition.item),
        //         decreaseWorkers(ownProps.type, workers),
        //     ];
        //     const start = startTask(TaskType.craftItem,
        //         productionDefinition.item,
        //         `${ownProps.type}.craft`,
        //         craftingTime,
        //         callbacks);
        //     dispatch(start);
        // },
        // onUpgrade: (cost: number) => {
        //     dispatch(subtractGold(cost));
        //     dispatch(upgradeStructure(ownProps.type)); // TODO: time to upgarde??
        // },
    };
}

// todo: I'm not sure if this Container needs an AppContext. If not. remove it later
export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(TavernStructureView);
