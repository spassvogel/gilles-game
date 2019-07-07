import { connect } from "react-redux";
import ResourcesBox, { Props, StateProps } from "src/components/ui/resources/ResourcesBox";
import { Resource } from "src/definitions/resources";
import { StoreState } from "src/stores";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
    const sufficientResources: Record<string, boolean> = {};
    Object.keys(ownProps.resources).forEach((resource: Resource) => {
        sufficientResources[resource] = store.resources[resource]! >= ownProps.resources[resource]!;
    });
    return {
        sufficientResources,
    };
};

export default connect<StateProps, null, Props, StoreState>(mapStateToProps)
    (ResourcesBox);
