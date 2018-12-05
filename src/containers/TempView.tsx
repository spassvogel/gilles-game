import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { addGold } from "src/actions/gold";
import { addResources } from "src/actions/resources";
import TempView, { DispatchProps} from "src/components/TempView";
import { ResourceStoreState } from "src/stores/resources";
import { StoreState } from "../stores";

// Temporary gui
function mapStateToProps(store: StoreState) {
    return {
    };
}
function mapDispatchToProps(dispatch: Dispatch<AnyAction>): DispatchProps {
    return {
        onCheatGold: (amount: number) => dispatch(addGold(amount)),
        onCheatResources: (amount: ResourceStoreState) => dispatch(addResources(amount)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TempView);
