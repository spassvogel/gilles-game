import ResourceStructureView,  { Props, DispatchProps }  from '../components/ResourceStructureView';

import * as actions from '../actions/structures';
import { StoreState } from '../stores';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StructureStoreState } from '../stores/structure';
import { Action } from 'src/actions/structures';

export function mapStateToProps(store:StoreState, ownProps:Props) {
    const structureStore:StructureStoreState = store.structures[ownProps.type];
    return { 
        gold: store.gold,
        level: structureStore.level,
        workers: structureStore.workers
    }
}

export function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps:Props) : DispatchProps {
    return {
        onUpgrade: () => { 
            dispatch(actions.upgradeStructure(ownProps.type))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceStructureView);