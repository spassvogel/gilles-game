import axios from "axios";
import * as React from "react";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Persistor } from "redux-persist";
import { State as seedrandomStateType } from "seedrandom";
import { gameTick } from "./actions/game";
import { addLogEntry } from "./actions/log";
import version from "./constants/version";
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
import * as Random from "./utils/random";
import { TextManager } from "./utils/textManager";

const initGame = async () => {
    const axiosResult = await axios.get("lang/en-US.json");
    const texts = axiosResult.data as Record<string, string>;
    TextManager.init(texts);
    Random.init("GILLESROX2");

    const { store, persistor, isHydrated } = await configureStore();
    if (!isHydrated) {
        startNewGame(store);
    } else {
        continueGame(store);
    }
    runGame(store, persistor);
};

/**
 * Gets called when a player
 * @param store
 */
const startNewGame = (store: any) => {

    store.dispatch(addLogEntry("test-game-welcome"));
    // todo: here is a good place to launch a tutorial or something

    // tslint:disable-next-line:no-console
    console.log(`Starting new GILLES-IDLE-GAME (version ${version})`);
};

const continueGame = (store: any) => {
    // tslint:disable-next-line:no-console
    console.log(`Continuing existing GILLES-IDLE-GAME (version ${version})`);
};

const runGame = (store: any, persistor: Persistor) => {
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

    /*
    * Will generate resources based on the structures in the town.
    * Wil lreturn a ResourceStoreState with the amount of each resource to add  */
    const getProducedResources = (delta: number, structures: StructuresStoreState) => {
        const result: ResourceStoreState = {};
        const resourceInterval = 60000; // every minute constitutes a resource tick. todo: move to some other shared place
        const factor = delta / resourceInterval;
        // this function can run at different intervals
        // faster or slower than once a minute
        // we will multiply the resource amount by the factor to normalize

        const handleStructure = (structure: string) => {
            const structureDefinition: StructureDefinition = structureDefinitions[structure];

            switch (structureDefinition.type) {
                case StructureType.resource:
                    const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
                    const level: number = structures[structure].level;
                    const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];

                    // Store all the resources that this structure will generate this tick into `result`
                    Object.keys(levelDefinition.generates).reduce((accumulator: ResourceStoreState, resource: string) => {
                        const amount: number = levelDefinition.generates[resource] * structures[structure].workers * factor;
                        accumulator[resource] = (accumulator[resource] || 0) + amount;
                        return accumulator;
                    }, result);
                    break;
            }
        };

        Object.keys(structures).forEach((structure) => handleStructure(structure));
        return result;
    };

    // store.dispatch(addGold(400));

    // TODO: find something less ugly and hacky than this
//    oracles.kill10b = theBigTree.getOracle("kill_10_boars", store);
  //  oracles["retrieve_magic_amulet"] = backstabbed.getOracle("retrieve_magic_amulet", store);

    const getRngState = (): seedrandomStateType | null => {
        if (Random.dirty) {
            return Random.state();
        }
        return null;
    };

    const gameLoop = () => {
        const state: StoreState = store.getState();
        const delta = Date.now() - state.engine.lastTick;

    //    state.
        const resources = getProducedResources(delta, state.structures);
        const rngState = getRngState();
        store.dispatch(gameTick(delta, rngState, resources));

        processCompletedTasks(state.tasks);

        // store.dispatch(addLogEntry("test-you-have-found-an-item", { item: "sword" }));

    };

    setInterval(gameLoop, 2500);
};

initGame();
