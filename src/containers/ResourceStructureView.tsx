import ResourceStructureView,  { Props, DispatchProps }  from '../components/ResourceStructureView';

import * as actions from '../actions';
import * as structureActions from '../actions/structures';
import { StoreState } from '../stores';
import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { StructureStoreState } from '../stores/structure';

export function mapStateToProps(store:StoreState, ownProps:Props) {
    const structureStore:StructureStoreState = store.structures[ownProps.type];
    return { 
        gold: store.gold,
        level: structureStore.level,
        workers: structureStore.workers
    }
}

export function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps:Props) : DispatchProps {
    return {
        onUpgrade: (cost:number) => {
            dispatch(actions.subtractGold(cost));
            dispatch(structureActions.upgradeStructure(ownProps.type)); // Todo: time??
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceStructureView);