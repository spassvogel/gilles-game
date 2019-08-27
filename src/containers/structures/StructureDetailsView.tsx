import { addGold } from "actions/gold";
import { addResources } from "actions/resources";
import StructureDetailsView, { DispatchProps, Props, StateProps } from "components/StructureDetailsView";
import { Props as WindowProps } from "components/ui/window/Window";
import { withWindow } from "hoc/withWindow";
import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction, compose } from "redux";
import { ResourceStoreState } from "stores/resources";
import { StoreState } from "../../stores";

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

export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withWindow,
)(StructureDetailsView) as React.ComponentType<Props & WindowProps>;
