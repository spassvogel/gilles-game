// // tslint:disable:object-literal-sort-keys

// import { Resource } from "definitions/resources";
// import { connect } from "react-redux";
// import ResourceViewRow,  { Props } from "../components/ResourceViewRow";
// import { StoreState } from "../stores";

// const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
//     if (store.resources) {
//         const name: string = Resource[ownProps.type];
//         return {
//             type: ownProps.type,
//             amount: store.resources[name],
//         };
//     }
//     return {

//     };
// }

// // export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
// //   return {
// //     onIncrement: () => dispatch(actions.incrementEnthusiasm()),
// //     onDecrement: () => dispatch(actions.decrementEnthusiasm()),
// //   }
// // }
// export default connect<StateProps, null, null, StoreState>(mapStateToProps)(ResourceViewRow);
