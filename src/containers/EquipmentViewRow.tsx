
import { connect } from "react-redux";
import EquipmentViewRow,  { Props, StateProps } from "../components/EquipmentViewRow";
import { StoreState } from "../stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        amount: store.equipment[ownProps.type],
    };
}

// export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
//   return {
//     onIncrement: () => dispatch(actions.incrementEnthusiasm()),
//     onDecrement: () => dispatch(actions.decrementEnthusiasm()),
//   }
// }

export default connect<StateProps, any, Props, StoreState>(mapStateToProps)(EquipmentViewRow);
