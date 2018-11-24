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
//import { Weapons } from './types';

rootReducer
const store = createStore<StoreState, any, any, any>(rootReducer, {});

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

// Will generate resources based on the structures built
const updateStructures = () => {
    // Very temporary
    var state:StoreState = store.getState();
    //console.log(state.structures);
    
    /*for(let i = 0; i < state.structures.lumberMills; i++){
        store.dispatch(actions.addResource('wood', 3));
    }
    for(let i = 0; i < state.structures.ironMines; i++){
        store.dispatch(actions.addResource('iron', 2));
    }
    for(let i = 0; i < state.structures.farms; i++){
        store.dispatch(actions.addResource('pigs', 1));
    }
    for(let i = 0; i < state.structures.alchemists; i++){
        store.dispatch(actions.addResource('gunpowder', 3));
    }*/
}

store.dispatch(addGold(40)); 
setInterval(() => {
    
//    state.
    updateStructures();
//    store.dispatch(gameTickActions.gameTick())
}, 500);


