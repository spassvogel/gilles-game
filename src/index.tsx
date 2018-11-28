import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import  rootReducer from './reducers/index';
import { StoreState } from './stores';
import { Provider } from 'react-redux';
import * as actions from './actions/';
import * as gameTickActions from './actions/game';
import Topbar from './containers/Topbar';
import { addGold } from './actions/gold';
import TempView from './containers/TempView';
import structureDefinitions, {
    ResourceStructureDefinition, 
    ResourceStructureLevelDefinition, 
    StructureDefinition,
    StructureType
} from './definitions/structures';
import { startTask, updateTasks } from './actions/tasks';
import { TaskType, TaskStoreState } from './stores/task';
import { TasksStoreState } from './stores/tasks';
import { StructuresStoreState } from './stores/structures';
import { gameTick } from './actions/game';

const store = createStore<StoreState, any, any, any>(
    rootReducer, 
    {}, 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Topbar/>
            <TempView />
        </div>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();

// TODO: place these 'controllers' somewhere else

// Will generate resources based on the structures built
const processStructures = (structures:StructuresStoreState) => {
    // Very temporary

    const handleStructure = (structure:string) => {     
        const structureDefinition:StructureDefinition = structureDefinitions[structure];
        
        switch(structureDefinition.type) {
            case StructureType.resource:
                const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                const level:number = structures[structure].level || 0;
                const levelDefinition:ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];
        
                Object.keys(levelDefinition.generates).forEach(resource => {
                    const amount:number = levelDefinition.generates[resource] * structures[structure].workers;
                    //console.log(`${resource}: ${amount}`)
                    // todo: bundle this and send as one!
                    store.dispatch(actions.addResource(resource, amount));
                });
            break;
        }
    };

    Object.keys(structures).forEach(structure => handleStructure(structure));    
}

const processTasks = (tasks:TasksStoreState) => {
    const handleCompletedTask = (task:TaskStoreState) => {
        store.dispatch(task.callback);
    } 
    store.dispatch(updateTasks()); 

    tasks.completed.forEach(task => handleCompletedTask(task));
}

store.dispatch(addGold(40)); 
setInterval(() => {
    var state:StoreState = store.getState();

//    state.
   // processStructures(state.structures);
    processTasks(state.tasks);
    //store.dispatch(gameTick())

}, 2500);


