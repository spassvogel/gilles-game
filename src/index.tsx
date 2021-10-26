import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store, AnyAction, DeepPartial } from "redux";
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
import { getWorldLink } from "utils/routing";
import { createInitialStore } from "store/reducers";
import getHarvest from "mechanics/gameTick/harvest";
import "./index.css";

const TICK_INTERVAL = 2500;
let persistor: Persistor;

const initGame = async () => {
  const texts = await loadResourceAsync(`${process.env.PUBLIC_URL}/lang/en.json`);
  if (texts) {
    TextManager.init(texts.data);
  }
  Random.init("GILLESROX2");

  setupStore();
};

/**
 * Attemps to read persisted store state. Calls `runGame`
 */
const setupStore = async (initial: DeepPartial<StoreState> = {}) => {
  const storeConfiguration = await configureStore(initial);
  const { store, isHydrated } = storeConfiguration;
  persistor = storeConfiguration.persistor;

  if (!isHydrated) {
    startNewGame(store);
  } else {
    continueGame();
  }
  runGame(store);
}

/**
 * Gets called when a player starts a new game
 * @param store
 */
const startNewGame = (store: Store<StoreState, AnyAction>) => {
  store.dispatch(startGame());
  store.dispatch(addLogText("test-game-welcome"));
  // todo: here is a good place to launch a tutorial or something

  console.log(`Starting new GAME (version ${version})`);
};


/**
 * Continue playing earlier persisted store
 * @param store
 */
const continueGame = () => {
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
  location.href = `#${getWorldLink()}`; // todo: load path from metadata '#/world/kill10Boars';
}

const restartGame = () => {
  // eslint-disable-next-line no-restricted-globals
  if(confirm('Are you sure you wish to reset all your progress?')){
    clearTimeout(interval);
    persistor.purge();
    localforage.clear();

    setupStore(createInitialStore());
    // eslint-disable-next-line no-restricted-globals
    location.reload();
    // location.href = `#${getTownLink()}`;
    console.clear();
  }
}


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
    const harvestUpdates = getHarvest(state);
    const rngState = getRngState();
    const { questUpdates, logUpdates } = getQuestUpdates(delta, store);
    logs.push(...logUpdates);

    store.dispatch(gameTick(delta, rngState, resourcesUpdates, questUpdates, harvestUpdates, logs));

    processCompletedTasks(state.tasks, store.dispatch);
  };

  interval = setInterval(gameLoop, TICK_INTERVAL);
};
export {runGame, restartGame, loadGame};

initGame();
