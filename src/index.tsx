import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import ResourceView from './components/ResourceView';
import { createStore } from 'redux';
import  rootReducer from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';
import * as actions from './actions/';
//import { Weapons } from './types';

rootReducer
const store = createStore<StoreState, any, any, any>(rootReducer, {
    // [Weapons.CROSSBOWS]: 3,
    // [Weapons.LONGBOWS]: 2,
    // [Weapons.SWORDS]: 4,
    // [Weapons.DAGGERS]: 2
});

ReactDOM.render(
    <Provider store={store}>
     <ResourceView />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();

setInterval(() => {
    store.dispatch(actions.incrementCrossbows())
}, 500)
setInterval(() => {
    store.dispatch(actions.incrementLongbows())
}, 700)