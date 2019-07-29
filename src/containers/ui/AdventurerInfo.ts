import { moveItemInInventory } from "actions/adventurers";
import AdventurerInfo, { DispatchProps, Props } from "components/ui/AdventurerInfo";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";

const mapStateToProps = (store: StoreState) => {

    return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        // Moves item within an adventurers' inventory
        onMoveItemInInventory: (adventurerId: string, fromSlot: number, toSlot: number) => {
            const action = moveItemInInventory(adventurerId, fromSlot, toSlot);
            dispatch(action);
        },
    };
};

export default connect<object, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(AdventurerInfo);
