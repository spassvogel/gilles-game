import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import ResourceView from './components/TempView';
import { createStore } from 'redux';
import  rootReducer from './reducers/index';
import { StoreState } from './stores';
import { Provider } from 'react-redux';
//import * as actions from './actions/';
import * as gameTickActions from './actions/game';
//import { Weapons } from './types';

rootReducer
const store = createStore<StoreState, any, any, any>(rootReducer, {});

ReactDOM.render(
    <Provider store={store}>
     <ResourceView />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();


setInterval(() => {
//    console.log();
    var state:StoreState = store.getState();
//    state.
    //updateStructures();
//    store.dispatch(gameTickActions.gameTick())
}, 500);

/*setInterval(() => {
    store.dispatch(actions.incrementCrossbows())
}, 500)
setInterval(() => {
    store.dispatch(actions.incrementLongbows())
}, 700)*/
/*
updateStructures() {
    
}*/