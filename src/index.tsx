import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import ResourceView from './components/ResourceView';
import { createStore } from 'redux';
import { resources } from './reducers/index';
import { StoreState } from './types/index';
import { Provider } from 'react-redux';
//import { Dispatch } from 'redux';
import * as actions from './actions/';
import { Resources } from './types';


const store = createStore<StoreState, any, any, any>(resources, {
    [Resources.CROSSBOWS]: 3,
    [Resources.LONGBOWS]: 2,
    [Resources.SWORDS]: 4,
    [Resources.DAGGERS]: 2
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