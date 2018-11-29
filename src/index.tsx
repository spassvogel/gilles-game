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

store.dispatch(addGold(40)); 
setInterval(() => {
    var state:StoreState = store.getState();

//    state.
   // processStructures(state.structures);
    processTasks(state.tasks);
    //store.dispatch(gameTick())

}, 2500);


