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
import structureDefinitions, { ResourceStructureDefinition, ResourceStructureLevelDefinition } from './definitions/structures';
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
    Object.keys(state.structures).forEach(structure => {
        const structureDefinition:ResourceStructureDefinition = structureDefinitions[structure];
        const level:number = state.structures[structure].level || 0;
        const levelDefinition:ResourceStructureLevelDefinition = structureDefinition.levels[level];

        Object.keys(levelDefinition.generates).forEach(resource => {
            const amount:number = levelDefinition.generates[resource] * state.structures[structure].workers;
            //console.log(`${resource}: ${amount}`)
            store.dispatch(actions.addResource(resource, amount));
        });
    });

}

store.dispatch(addGold(40)); 
setInterval(() => {
    
//    state.
    updateStructures();
//    store.dispatch(gameTickActions.gameTick())
}, 2500);


