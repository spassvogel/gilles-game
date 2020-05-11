import { startCombatAction } from "actions/combat";
import CombatView, { DispatchProps, Props, StateProps } from "components/combat/CombatView";
import { withWindow } from "hoc/withWindow";
import { connect } from "react-redux";
import { AnyAction, compose, Dispatch } from "redux";
import { StoreState } from "stores";
import { CombatActionType } from "stores/combat";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
    return {
        combat: store.combat,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        onStartAction: (type: CombatActionType, actor: string, target: [number, number], endsAt: number) => {
            dispatch(startCombatAction(type, actor, target, endsAt));
        },
    };
};

export default compose<React.ComponentType<Props>>(
    withWindow,
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
)(CombatView);
