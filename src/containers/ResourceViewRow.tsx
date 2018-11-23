
import ResourceViewRow,  { Props }  from '../components/ResourceViewRow';
import { StoreState } from '../stores';
import { connect } from 'react-redux';
import { ResourceType } from 'src/definitions/resources';

export function mapStateToProps(store:StoreState, ownProps:Props) {
    if(store.resources){
        const name:string = ResourceType[ownProps.type]
        return {
            type: ownProps.type,
            name,
            amount: store.resources[name]
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