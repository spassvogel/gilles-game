import { addWorkers } from "actions";
import { addGold } from "actions/gold";
import { addItemToWarehouse } from "actions/items";
import { addResources } from "actions/resources";
import { setStructureState } from "actions/structures";
import CheatBox, { DispatchProps, Props, StateProps } from "components/CheatBox";
import { Item } from "definitions/items/types";
import { Structure } from "definitions/structures";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";
import { ResourceStoreState } from "stores/resources";
import { StructureState } from "stores/structure";

const mapStateToProps = (store: StoreState): StateProps => {
    return {
        structures: store.structures,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        onCheatGold: (amount: number) => dispatch(addGold(amount)),
        onCheatItem: (item: Item) => dispatch(addItemToWarehouse(item)),
        onCheatResources: (amount: ResourceStoreState) => dispatch(addResources(amount)),
        onCheatStructureState: (structure: Structure, state: StructureState) => dispatch(setStructureState(structure, state)),
        onCheatWorkers: (amount: number) => dispatch(addWorkers(amount)),
    };
};

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(CheatBox);
