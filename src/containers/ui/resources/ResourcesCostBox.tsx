import ResourcesCostBox, { Props, StateProps } from "components/ui/resources/ResourcesCostBox";
import { connect } from "react-redux";
import { StoreState } from "stores";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
    const sufficientResources: Record<string, boolean> = {};
    Object.keys(ownProps.resources).forEach((resource: string) => {
        sufficientResources[resource] = store.resources[resource]! >= ownProps.resources[resource]!;
    });
    return {
        sufficientResources,
    };
};

export default connect<StateProps, null, Props, StoreState>(mapStateToProps)(ResourcesCostBox);
