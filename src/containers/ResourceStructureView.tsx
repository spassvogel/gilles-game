import ResourceStructureView,  { Props, DispatchProps }  from '../components/ResourceStructureView';

import * as actions from '../actions';
import { StoreState } from '../stores';
import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { StructureStoreState } from '../stores/structure';
import { subtractGold } from 'src/actions/gold';
import { upgradeStructure, increaseWorkers, decreaseWorkers } from 'src/actions/structures';
import { selectFreeWorkers } from 'src/selectors/workers';

function mapStateToProps(store:StoreState, ownProps:Props) {
    const structureStore:StructureStoreState = store.structures[ownProps.type];
    return { 
        gold: store.gold,
        level: structureStore.level,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store)
    }
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps:Props) : DispatchProps {
    return {
        onUpgrade: (cost:number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(ownProps.type)); // Todo: time??
        },
        onWorkersUp: () => {
            dispatch(increaseWorkers(ownProps.type));  
        },
        onWorkersDown: () => {
            dispatch(decreaseWorkers(ownProps.type)); 
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceStructureView);