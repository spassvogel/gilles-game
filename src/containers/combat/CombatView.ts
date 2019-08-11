import CombatView, { Props, StateProps, DispatchProps } from "components/combat/CombatView";
import { withWindow } from "hoc/withWindow";
import { connect } from "react-redux";
import { compose, AnyAction, Dispatch } from 'redux';
import { StoreState } from "stores";
import { CombatActionType, Actor } from 'stores/combat';

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
    return {
        combat: store.combat,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): DispatchProps => {
    return {
        onStartAction: (type: CombatActionType, actor: Actor, target: number[], endsAt: number) => {
            
        }
    };
};

export default compose<React.ComponentType<Props>>(
    withWindow,
    connect<StateProps, null, Props, StoreState>(mapStateToProps),
)(CombatView);
