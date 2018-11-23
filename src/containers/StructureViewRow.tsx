// // OBSOLETE
// import StructureViewRow,  { Props, DispatchProps }  from '../components/StructureViewRow';

// import * as actions from '../actions/';
// import { StoreState } from '../stores';
// import { connect } from 'react-redux';
// import { Dispatch } from 'redux';

// export function mapStateToProps(store:StoreState, ownProps:Props) {
//     if(store.structures){
//         return {
//             amount: store.structures[ownProps.name]
//         }
//     }
//     return {};
// }

// export function mapDispatchToProps(dispatch: Dispatch<actions.StructureAction>, ownProps:Props) : DispatchProps {
//     return {
//         onChange: (amount:number) => { 
//             dispatch(actions.setStructureAmount(ownProps.name, amount))
//         }
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(StructureViewRow);