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

// Will generate resources based on the structures built
const updateStructures = () => {
    // Very temporary
    var state:StoreState = store.getState();
    Object.keys(state.structures).forEach(structure => {     
        const structureDefinition:StructureDefinition = structureDefinitions[structure];
        
        switch(structureDefinition.type) {
            case StructureType.resource:
                const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                const level:number = state.structures[structure].level || 0;
                const levelDefinition:ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];
        
                Object.keys(levelDefinition.generates).forEach(resource => {
                    const amount:number = levelDefinition.generates[resource] * state.structures[structure].workers;
                    //console.log(`${resource}: ${amount}`)
                    store.dispatch(actions.addResource(resource, amount));
                });
            break;
        }
    });

}

store.dispatch(addGold(40)); 
setInterval(() => {
    
//    state.
    updateStructures();
//    store.dispatch(gameTickActions.gameTick())
}, 2500);


