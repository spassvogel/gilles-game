import updateCombat from "mechanics/gameTick/combat";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Persistor } from "redux-persist";
import { gameTick } from "./actions/game";
import { addLogEntry } from "./actions/log";
import version from "./constants/version";
import App from "./containers/App";
import getProducedResources from "./mechanics/gameTick/producedResources";
import getQuestUpdates, { LogUpdate } from "./mechanics/gameTick/quests";
import getRngState from "./mechanics/gameTick/rngState";
import registerServiceWorker from "./registerServiceWorker";
import { StoreState } from "./stores";
import configureStore from "./utils/configureStore";
import * as Random from "./utils/random";
import { TextManager } from "./global/TextManager";
import { loadResourceAsync } from 'utils/pixiJs';
import { processCompletedTasks } from 'mechanics/gameTick/tasks';
import "./index.css";

const TICK_INTERVAL = 2500;

const initGame = async () => {
    const texts = await loadResourceAsync(`${process.env.PUBLIC_URL}/lang/en-US.json`);
    TextManager.init(texts.data);
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
 * Gets called when a player starts a new game
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

// const stopGame = () => {
//     clearTimeout(interval);
// };

const runGame = (store: any, persistor: Persistor) => {
    ReactDOM.render((
        <Provider store={store}>
            <App persistor={persistor} />
        </Provider>
    ),
        document.getElementById("root") as HTMLElement,
    );
    registerServiceWorker();

    // store.dispatch(addGold(400));

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

    setInterval(gameLoop, TICK_INTERVAL);
};

initGame();
