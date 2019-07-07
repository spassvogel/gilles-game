import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { addWorkers } from "src/actions";
import { addGold } from "src/actions/gold";
import { addItemToWarehouse } from "src/actions/items";
import { addResources } from "src/actions/resources";
import { setStructureState } from "src/actions/structures";
import CheatBox, { DispatchProps, Props, StateProps } from "src/components/CheatBox";
import { Item } from "src/definitions/items/types";
import { Structure } from "src/definitions/structures";
import { StoreState } from "src/stores";
import { ResourceStoreState } from "src/stores/resources";
import { StructureState } from "src/stores/structure";

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

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (CheatBox);
