
import ResourceViewRow from '../components/ResourceViewRow';
import { Props } from '../components/ResourceViewRow';
//import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
//import { Dispatch } from 'redux';

export function mapStateToProps(store:StoreState, ownProps:Props) {
    return {
        amount: store[ownProps.name]
    }
}

// export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
//   return {
//     onIncrement: () => dispatch(actions.incrementEnthusiasm()),
//     onDecrement: () => dispatch(actions.decrementEnthusiasm()),
//   }
// }

export default connect(mapStateToProps)(ResourceViewRow);