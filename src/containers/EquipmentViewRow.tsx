
import ResourceViewRow,  { Props }  from '../components/ResourceViewRow';
import { StoreState } from '../stores';
import { connect } from 'react-redux';

export function mapStateToProps(store:StoreState, ownProps:Props) {
    if(store.equipment){
        return {
            amount: store.equipment[ownProps.name]
        }
    }
    return {
        
    }
}

// export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
//   return {
//     onIncrement: () => dispatch(actions.incrementEnthusiasm()),
//     onDecrement: () => dispatch(actions.decrementEnthusiasm()),
//   }
// }

export default connect(mapStateToProps)(ResourceViewRow);