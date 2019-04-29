import * as React from "react";
import texts from "./lang/en-US";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { State as seedrandomStateType } from "seedrandom";
import { gameTick } from "./actions/game";
import { addGold } from "./actions/gold";
import App from "./containers/App";
import { backstabbed } from "./definitions/encounters/backstabbed";
import { theBigTree } from "./definitions/encounters/theBigTree";
import structureDefinitions from "./definitions/structures";
import { ResourceStructureDefinition,
    ResourceStructureLevelDefinition, StructureDefinition, StructureType } from "./definitions/structures/types";
import "./index.css";
import { oracles } from "./oracle";
import registerServiceWorker from "./registerServiceWorker";
import { StoreState } from "./stores";
import { ResourceStoreState } from "./stores/resources";
import { StructuresStoreState } from "./stores/structures";
import { TaskStoreState } from "./stores/task";
import { TasksStoreState } from "./stores/tasks";
import configureStore from "./utils/configureStore";
import * as random from "./utils/random";
import { TextManager } from "./utils/textManager";
import { addLogEntry } from "./actions/log";

const { store, persistor } = configureStore();

TextManager.init(texts);
console.log(TextManager.get("resource-food-name"));
store.dispatch(addLogEntry("resource-food-name"));

ReactDOM.render(
    <Provider store={store}>
        <DragDropContextProvider backend={ HTML5Backend }>
            <App persistor={ persistor }/>
        </DragDropContextProvider>
     </Provider>,
    document.getElementById("root") as HTMLElement,
);
registerServiceWorker();

// TODO: Check HMR: https://github.com/wmonk/create-react-app-typescript/pull/312#issuecomment-385617913

const processCompletedTasks = (tasks: TasksStoreState) => {
    const handleCompletedTask = (task: TaskStoreState) => {
        // Fire all callbacks
        task.callbacks.forEach((action) => store.dispatch(action));
    };

    tasks.completed.forEach((task) => handleCompletedTask(task));
};

// TODO: place these 'controllers' somewhere else

// Will generate resources based on the structures in the town

const getProducedResources = (delta: number, structures: StructuresStoreState) => {
    const resourceInterval = 60000; // every minute constitutes a resource tick. todo: move to some other shared place
    const factor = delta / resourceInterval;
    // this function can run at different intervals
    // faster or slower than once a minute
    // we will multiply the resource amount by the factor to normalize

    const resourcesToAdd: ResourceStoreState = {};

    const handleStructure = (structure: string) => {
        const structureDefinition: StructureDefinition = structureDefinitions[structure];

        switch (structureDefinition.type) {
            case StructureType.resource:
                const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                const level: number = structures[structure].level;
                const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];

                Object.keys(levelDefinition.generates).reduce((accumulator: ResourceStoreState, resource: string) => {
                    const amount: number = levelDefinition.generates[resource] * structures[structure].workers * factor;
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
store.dispatch(addGold(400));

// TODO: find something less ugly and hacky than this
oracles.kill10boars = theBigTree.getOracle("kill10boars", store);
oracles.retrieveMagicAmulet = backstabbed.getOracle("retrieveMagicAmulet", store);

const getRngState = (): seedrandomStateType | null => {
    if (random.dirty) {
        return random.state();
    }
    return null;
};

setInterval(() => {
    const state: StoreState = store.getState();
    const delta = Date.now() - state.engine.lastTick;

//    state.
    const resources = getProducedResources(delta, state.structures);
    const rngState = getRngState();
    store.dispatch(gameTick(delta, rngState, resources));

    processCompletedTasks(state.tasks);
}, 2500);

/*
Var basespeed = 3; // ticks per sec
Update(){
Var delta = lastTick - now()
Var ticks
For(var I = 0; I < delta / (1000 / basespeed); I++)*/
