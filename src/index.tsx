import updateCombat from "mechanics/gameTick/combat";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store, AnyAction } from "redux";
import { Persistor } from "redux-persist";
import localforage from 'localforage';
import { gameTick, startGame } from "store/actions/game";
import { addLogText } from "store/actions/log";
import version from "./constants/version";
import App from "./components/App";
import getProducedResources from "./mechanics/gameTick/producedResources";
import getQuestUpdates, { LogUpdate } from "./mechanics/gameTick/quests";
import getRngState from "./mechanics/gameTick/rngState";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./utils/configureStore";
import * as Random from "./utils/random";
import { TextManager } from "./global/TextManager";
import { loadResourceAsync } from 'utils/pixiJs';
import { processCompletedTasks } from 'mechanics/gameTick/tasks';
import { StoreState } from 'store/types';
import "./index.css";

// Todo: Refactor into class
const TICK_INTERVAL = 2500;
let persistor: Persistor;

const initGame = async () => {
    const texts = await loadResourceAsync(`${process.env.PUBLIC_URL}/lang/en-US.json`);
    TextManager.init(texts.data);
    Random.init("GILLESROX2");

    readPersistedStore();
};

/**
 * Attemps to read persisted store state. Calls `runGame`
 */
const readPersistedStore = async () => {
    const storeConfiguration = await configureStore();
    const { store, isHydrated } = storeConfiguration;
    persistor = storeConfiguration.persistor;

    if (!isHydrated) {
        startNewGame(store);
    } else {
        continueGame(store);
    }
    runGame(store);
}

/**
 * Gets called when a player starts a new game
 * @param store
 */
const startNewGame = (store: any) => {
console.log("STARTING NEW GAME")
    store.dispatch(startGame());
    store.dispatch(addLogText("test-game-welcome"));
    // todo: here is a good place to launch a tutorial or something

    // tslint:disable-next-line:no-console
    console.log(`Starting new GAME (version ${version})`);
};


/**
 * Continue playing earlier persisted store
 * @param store
 */
const continueGame = (store: any) => {
    // tslint:disable-next-line:no-console
    console.log(`Continuing existing GAME (version ${version})`);
};

/**
 * Loads a saved game from a file
 */
const loadGame = async (state: StoreState) => {
    // todo: implement in MenuWindow!
    await persistor.purge();
    const { store } = await configureStore(state);
    runGame(store);

    // We have to cause the page to reinitialize and all react components to remount
    // eslint-disable-next-line no-restricted-globals
    location.href = '#/world/'; // todo: load path from metadata '#/world/kill10Boars';
}

const restartGame = () => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you wish to reset all your progress?')){
        clearTimeout(interval);
        persistor.purge();
        localforage.clear();

        readPersistedStore();
        // eslint-disable-next-line no-restricted-globals
        location.href = "#/town"
    }
}

// const stopGame = () => {
//     clearTimeout(interval);
// };

let interval: NodeJS.Timeout;
const runGame = (store: Store<StoreState, AnyAction>) => {
    clearTimeout(interval);

    ReactDOM.render((
        <Provider store={store}>
            <App persistor={persistor} />
        </Provider>
        ),
        document.getElementById("root") as HTMLElement,
    );
    registerServiceWorker();

    const gameLoop = () => {
        const state: StoreState = store.getState();
        const delta = Date.now() - state.engine.lastTick;

        const logs: LogUpdate[] = [];
        const resourcesUpdates = getProducedResources(state.engine.lastProducedUpdate, state);
        const rngState = getRngState();
        updateCombat(delta, store);
        const { questUpdates, logUpdates } = getQuestUpdates(delta, store);
        logs.push(...logUpdates);

        store.dispatch(gameTick(delta, rngState, resourcesUpdates, questUpdates, logs));

        processCompletedTasks(state.tasks, store.dispatch);

        // store.dispatch(addLogEntry("test-you-have-found-an-item", LogChannel.common, { item: Item.teeth }));
    };

    interval = setInterval(gameLoop, TICK_INTERVAL);
};
export {runGame, restartGame, loadGame};

initGame();
