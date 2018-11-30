
import { StoreState } from '../stores';
import { connect } from 'react-redux';
import PartyScreen, { Props, StateProps } from 'src/components/PartyScreen';
import { any } from 'prop-types';

function mapStateToProps(store:StoreState, ownProps:Props):StateProps{
    return {
        adventurers: store.adventurers
    }
}

// export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
//   return {
//     onIncrement: () => dispatch(actions.incrementEnthusiasm()),
//     onDecrement: () => dispatch(actions.decrementEnthusiasm()),
//   }
// }

export default connect<StateProps, any, Props, StoreState>(mapStateToProps)(PartyScreen);