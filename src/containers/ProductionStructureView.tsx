import ProductionStructureView,  { Props, DispatchProps }  from '../components/ProductionStructureView';

import { StoreState } from '../stores';
import { connect } from 'react-redux';
import { Dispatch, AnyAction } from 'redux';
import { StructureStoreState } from '../stores/structure';
import { subtractGold } from 'src/actions/gold';
import { upgradeStructure, increaseWorkers, decreaseWorkers } from 'src/actions/structures';
import { selectFreeWorkers } from 'src/selectors/workers';
import { craft } from 'src/actions/equipment';
import { ProductionDefinition } from 'src/definitions/structures';
import { startTask } from 'src/actions/tasks';
import { TaskType } from 'src/stores/taskStoreState';
import * as time from 'src/utils/time';

function mapStateToProps(store:StoreState, ownProps:Props) {
    const structureStore:StructureStoreState = store.structures[ownProps.type];

    const TEMP_PROGRESS = (store.scheduledTasks[0]) ? store.scheduledTasks[0].progress : 0;
    return { 
        gold: store.gold,
        level: structureStore.level,
        workers: structureStore.workers,
        workersFree: selectFreeWorkers(store),
        resources: store.resources,
        TEMP_PROGRESS
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
        },
        onCraft: (productionDefinition:ProductionDefinition) => {
            dispatch(startTask(TaskType.constructEquipment, 'crossbow', 'blacksmith', time.ONE_MINUTE))
            dispatch(craft(productionDefinition));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductionStructureView);