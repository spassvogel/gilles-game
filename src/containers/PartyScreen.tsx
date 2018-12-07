
import { any } from "prop-types";
import { connect } from "react-redux";
import PartyScreen, { Props, StateProps, DispatchProps } from "src/components/PartyScreen";
import { StoreState } from "../stores";
import { Dispatch, AnyAction } from "redux";
import { moveEquipmentInInventory } from "src/actions/adventurers";
import { Equipment } from "src/definitions/equipment/types";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        adventurers: store.adventurers,
    };
}

export function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onMoveEquipmentInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveEquipmentInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        }
    }
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(PartyScreen);
