import { addWorkers } from "actions";
import { addGold } from "actions/gold";
import { addItemToWarehouse } from "actions/items";
import { addLogEntry } from "actions/log";
import { addResources } from "actions/resources";
import { setStructureState } from "actions/structures";
import { Props as WindowProps } from "components/ui/window/Window";
import CheatWindow, { DispatchProps, Props, StateProps } from "components/ui/window/windows/CheatWindow";
import { resourceOrder } from "constants/resources";
import { Item } from "definitions/items/types";
import { Structure } from "definitions/structures";
import { withWindow } from "hoc/withWindow";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { StoreState } from "stores";
import { LogChannel } from "stores/logEntry";
import { ResourceStoreState } from "stores/resources";
import { StructureState } from "stores/structure";

const mapStateToProps = (store: StoreState): StateProps => {
    return {
        structures: store.structures,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        onCheatGold: (amount: number) => {
            dispatch(addGold(amount));
            dispatch(addLogEntry("common-cheat-gold-added", { amount }, LogChannel.common));
        },
        onCheatItem: (item: Item) => {
            dispatch(addItemToWarehouse(item));
            dispatch(addLogEntry("common-cheat-item-added", { item }, LogChannel.common));
        },
        onCheatResources: (amount: number) => {
            // Create ResourceStoreState where value of each resource is `amount`
            const resources = resourceOrder.reduce((acc: ResourceStoreState, resource) => {
                acc[resource] = amount;
                return acc;
            }, {});

            dispatch(addResources(resources));
            dispatch(addLogEntry("common-cheat-resources-added", { amount }, LogChannel.common));
        },
        onCheatStructureState: (structure: Structure, state: StructureState) => dispatch(setStructureState(structure, state)),
        onCheatWorkers: (amount: number) => {
            dispatch(addWorkers(amount));
            dispatch(addLogEntry("common-cheat-workers-added", { amount }, LogChannel.common));
        },
    };
};

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withWindow,
)(CheatWindow) as React.ComponentType<Props & WindowProps>;
