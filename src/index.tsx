import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { seedrandomStateType } from "seedrandom";
import { gameTick } from "./actions/game";
import { addGold } from "./actions/gold";
import { addResources } from "./actions/resources";
import { updateTasks } from "./actions/tasks";
import TempView from "./containers/TempView";
import Topbar from "./containers/Topbar";
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
        <div>
            <Topbar/>
            <TempView />
        </div>
    </Provider>,
    document.getElementById("root") as HTMLElement,
);
registerServiceWorker();

const processTasks = (tasks: TasksStoreState) => {
    const handleCompletedTask = (task: TaskStoreState) => {
        store.dispatch(task.callback);
    };
    store.dispatch(updateTasks());

    tasks.completed.forEach((task) => handleCompletedTask(task));
};

// TODO: place these 'controllers' somewhere else

// Will generate resources based on the structures built
const processStructures = (structures: StructuresStoreState) => {
    // Very temporary

    const resourcesToAdd: ResourceStoreState = {};

    const handleStructure = (structure: string) => {
        const structureDefinition: StructureDefinition = structureDefinitions[structure];

        switch (structureDefinition.type) {
            case StructureType.resource:
                const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                const level: number = structures[structure].level || 0;
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
    store.dispatch(addResources(resourcesToAdd));
};

random.init("GILLESROX2");
console.log(random.random());
console.log(random.random());

store.dispatch(addGold(40));

const getRngState = (): seedrandomStateType => {
    return random.state();
}

setInterval(() => {
    const state: StoreState = store.getState();



//    state.
    processStructures(state.structures);
    processTasks(state.tasks);

    const rngState = getRngState();
    store.dispatch(gameTick(rngState));

    // store.dispatch(gameTick()) todo: combine `updateTasks` and `addResources` into one gametick action

}, 2500);
