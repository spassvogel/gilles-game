import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import  rootReducer from './reducers/index';
import { StoreState } from './stores';
import { Provider } from 'react-redux';
import Topbar from './containers/Topbar';
import { addGold } from './actions/gold';
import TempView from './containers/TempView';
import { updateTasks } from './actions/tasks';
import { TaskStoreState } from './stores/task';
import { TasksStoreState } from './stores/tasks';
import { StructuresStoreState } from './stores/structures';
import { StructureDefinition, StructureType, ResourceStructureLevelDefinition, ResourceStructureDefinition } from './definitions/structures';
import { addResource, addResources } from './actions/resources';
import structureDefinitions from './definitions/structures';
import { ResourceStoreState } from './stores/resources';

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


const processTasks = (tasks:TasksStoreState) => {
    const handleCompletedTask = (task:TaskStoreState) => {
        store.dispatch(task.callback);
    } 
    store.dispatch(updateTasks()); 

    tasks.completed.forEach(task => handleCompletedTask(task));
}


// TODO: place these 'controllers' somewhere else

// Will generate resources based on the structures built
const processStructures = (structures:StructuresStoreState) => {
    // Very temporary

    const resourcesToAdd:ResourceStoreState = {};
    
    const handleStructure = (structure:string) => {     
        const structureDefinition:StructureDefinition = structureDefinitions[structure];
        
        switch(structureDefinition.type) {
            case StructureType.resource:
                const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                const level:number = structures[structure].level || 0;
                const levelDefinition:ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];
        
                Object.keys(levelDefinition.generates).reduce((accumulator:ResourceStoreState, resource:string) => {
                    const amount:number = levelDefinition.generates[resource] * structures[structure].workers;
                    accumulator[resource] = (accumulator[resource] || 0) + amount;
                    return accumulator;
                }, resourcesToAdd);
            break;
        }
    };

    Object.keys(structures).forEach(structure => handleStructure(structure));    
    store.dispatch(addResources(resourcesToAdd));
}

store.dispatch(addGold(40)); 
setInterval(() => {
    var state:StoreState = store.getState();

//    state.
    processStructures(state.structures);
    processTasks(state.tasks);


    //store.dispatch(gameTick()) todo: combine `updateTasks` and `addResources` into one gametick action

}, 2500);


