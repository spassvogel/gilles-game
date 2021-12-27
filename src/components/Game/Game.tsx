import { Store, AnyAction, DeepPartial } from "redux";
import { Persistor } from "redux-persist";
import localforage from 'localforage';
import { gameTick, ignoreVersionDiff, startGame } from "store/actions/game";
import { addLogText } from "store/actions/log";
import * as Version from "./../../constants/version";
import getProducedResources from "./../../mechanics/gameTick/producedResources";
import getQuestUpdates, { LogUpdate } from "./../../mechanics/gameTick/quests";
import getRngState from "./../../mechanics/gameTick/rngState";
import configureStore from "./../../utils/configureStore";
import { processCompletedTasks } from 'mechanics/gameTick/tasks';
import { StoreState } from 'store/types';
import { createInitialStore } from "store/reducers";
import getHarvest from "mechanics/gameTick/harvest";
import { convertIntToSemVer } from "utils/version";
import App from "components/App";
import { Provider as StoreProvider } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { createContext } from 'react';
import { PersistPartial } from "redux-persist/es/persistReducer";
import LoadingSpinner from "components/ui/loading/LoadingSpinner";

const TICK_INTERVAL = 2500; // main game tick
let persistor: Persistor;

type GameActionsContextProps = {
  pauseGame: () => void,
  continueGame: () => void,
  loadGame: (state: StoreState) => Promise<void>,
  restartGame: () => void,
}

const emptyFn = () => undefined;

export const GameActionsContext = createContext<GameActionsContextProps>({
  // values will all be overwritten in Game
  pauseGame: emptyFn,
  continueGame: emptyFn,
  loadGame: async (_state: StoreState) => Promise.resolve(),
  restartGame: emptyFn,
});

const Game = () => {

  const paused = useRef(false);
  const [store, setStore] = useState<Store<StoreState & PersistPartial, AnyAction>>();

  /**
   * Loads a saved game state into the redux store */
  const loadGame = async (state: StoreState) => {
    await persistor.pause();
    await configureStore(state);
    setStore(store); // no need if we are refreshing the page anyway

    // We have to cause the page to reinitialize and all react components to remount
    // eslint-disable-next-line no-restricted-globals
    // location.reload();
  }
  /**
   * Attemps to read persisted store state. Sets `store` state when done */
  const setupStore = useCallback(async (initial: DeepPartial<StoreState> = {}) => {
    const storeConfiguration = await configureStore(initial);
    const { store, isHydrated } = storeConfiguration;
    persistor = storeConfiguration.persistor;

    if (!isHydrated) {
      startNewGame(store);
    }
    setStore(store);
  }, []);

  /**
   * Gets called when a player starts a new game
   * @param store
   */
  const startNewGame = useCallback((store: Store<StoreState, AnyAction>) => {
    store.dispatch(startGame());
    store.dispatch(addLogText("test-game-welcome"));
    // todo: here is a good place to launch a tutorial or something

    console.log(`Starting new GAME (version ${Version.default})`);
  }, []);

  /**
   * Will kick off the main game loop. Needs to be called when the store is initialized */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!store) return;
    try {
      const gameVersion = store.getState().game?.version;
      if (gameVersion < Version.asInt && store.getState().game?.ignoreVersionDiff !== Version.asInt) {
        if (!confirm(`This game was initialized with version ${convertIntToSemVer(gameVersion)} which is older than the current client (${Version.default}). This might cause problems. Continue anyway? \n\n(pressing cancel will reset progress) `)) {
          restartGame();
          return
        }
        store.dispatch(ignoreVersionDiff());
      }

      const gameLoop = () => {
        if (paused.current) return;

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
    }
    catch(e) {
      console.log(e)
    }
    return () => {
      clearInterval(interval);
    }
  }, [store]);

  const pauseGame = useCallback(() => {
    paused.current = true;
  }, []);

  const continueGame = useCallback(() => {
    paused.current = false;
  }, []);

  const restartGame = useCallback(() => {
    persistor.pause();
    // eslint-disable-next-line no-restricted-globals
    if(confirm('Are you sure you wish to reset all your progress?')){
      persistor.purge();
      localforage.clear();

      setupStore(createInitialStore());
      // eslint-disable-next-line no-restricted-globals
      location.reload();
      // location.href = `#${getTownLink()}`;
      console.clear();
    }
    persistor.persist();
  }, []);

  useEffect(() => {
    if (!store) {
      setupStore();
    }
  }, [store]);

  if (!store) {
    return <LoadingSpinner />
  }
  return (
    <GameActionsContext.Provider value={{
      pauseGame,
      continueGame,
      loadGame,
      restartGame,
    }}>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </GameActionsContext.Provider>
  )
}

export default Game;

