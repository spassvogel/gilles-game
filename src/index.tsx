import * as React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { seedrandomStateType } from "seedrandom";
import { gameTick } from "./actions/game";
import { addGold } from "./actions/gold";
import App from "./containers/App";
import structureDefinitions from "./definitions/structures";
import { ResourceStructureDefinition,
    ResourceStructureLevelDefinition, StructureDefinition, StructureType } from "./definitions/structures/types";
import "./index.css";
import rootReducer from "./reducers/index";
import registerServiceWorker from "./registerServiceWorker";
import { StoreState } from "./stores";
import { ResourceStoreState } from "./stores/resources";
import { StructuresStoreState } from "./stores/structures";
import { TaskStoreState } from "./stores/task";
import { TasksStoreState } from "./stores/tasks";
import * as random from "./utils/random";

const store = createStore<StoreState, any, any, any>(
    rootReducer,
    {},
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

ReactDOM.render(
    <Provider store={store}>
        <DragDropContextProvider backend={HTML5Backend}>
            <App/>
        </DragDropContextProvider>
     </Provider>,
    document.getElementById("root") as HTMLElement,
);
registerServiceWorker();

// const processTasks = (tasks: TasksStoreState) => {
//     const handleCompletedTask = (task: TaskStoreState) => {
//         store.dispatch(task.callback);
//     };
//     store.dispatch(updateTasks());

//     //tasks.completed.forEach((task) => handleCompletedTask(task));
// };

const processCompletedTasks = (tasks: TasksStoreState) => {
    const handleCompletedTask = (task: TaskStoreState) => {
        store.dispatch(task.callback);
    };

    tasks.completed.forEach((task) => handleCompletedTask(task));
};

// TODO: place these 'controllers' somewhere else

// Will generate resources based on the structures in the town
const getProducedResources = (structures: StructuresStoreState) => {
    const resourcesToAdd: ResourceStoreState = {};
    const handleStructure = (structure: string) => {
        const structureDefinition: StructureDefinition = structureDefinitions[structure];

        switch (structureDefinition.type) {
            case StructureType.resource:
                const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                const level: number = structures[structure].level;
                const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];

                Object.keys(levelDefinition.generates).reduce((accumulator: ResourceStoreState, resource: string) => {
                    const amount: number = levelDefinition.generates[resource] * structures[structure].workers;
                    accumulator[resource] = (accumulator[resource] || 0) + amount;
                    return accumulator;
                }, resourcesToAdd);
                break;
        }
    };

    Object.keys(structures).forEach((structure) => handleStructure(structure));
    return resourcesToAdd;
};

random.init("GILLESROX2");
store.dispatch(addGold(40));

const getRngState = (): seedrandomStateType => {
    return random.state();
}

setInterval(() => {
    const state: StoreState = store.getState();



//    state.
    const resources = getProducedResources(state.structures);
    const rngState = getRngState();
    store.dispatch(gameTick(rngState, resources));

    processCompletedTasks(state.tasks);
}, 2500);
