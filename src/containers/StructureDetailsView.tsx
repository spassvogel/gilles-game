import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { addGold } from "src/actions/gold";
import { addResources } from "src/actions/resources";
import StructureDetailsView, { DispatchProps, Props, StateProps } from "src/components/StructureDetailsView";
import { ResourceStoreState } from "src/stores/resources";
import { StoreState } from "../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const buildTask = store.tasks.running.filter((val) => 
        val.origin === `town` && val.name === `${ownProps.structure}.build`)[0];

    return {
        buildTask,
        structures: store.structures,
    };
}
function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
    return {
        onCheatGold: (amount: number) => dispatch(addGold(amount)),
        onCheatResources: (amount: ResourceStoreState) => dispatch(addResources(amount)),
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)
    (StructureDetailsView);
