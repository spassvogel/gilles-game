import StructureDetailsView, { Props, StateProps } from "components/StructureDetailsView";
import { Props as WindowProps } from "components/ui/window/Window";
import { withWindow } from "hoc/withWindow";
import { connect } from "react-redux";
import { compose } from "redux";
import { StoreState } from "../../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const buildTask = store.tasks.running.filter((val) =>
        val.origin === `town` && val.name === `${ownProps.structure}.build`)[0];

    return {
        buildTask,
        structures: store.structures,
    };
}

export default compose(
    connect<StateProps, null, Props, StoreState>(mapStateToProps),
    withWindow,
)(StructureDetailsView) as React.ComponentType<Props & WindowProps>;
