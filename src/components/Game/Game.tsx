import { createContext } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Store, AnyAction, DeepPartial } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { gameTick, ignoreVersionDiff, startGame } from 'store/actions/game';
import { addLogText } from 'store/actions/log';
import * as Version from 'constants/version';
import getProducedResources from 'mechanics/gameTick/producedResources';
import getQuestUpdates, { LogUpdate } from 'mechanics/gameTick/quests';
import getRngState from 'mechanics/gameTick/rngState';
import configureStore from 'utils/configureStore';
import { processCompletedTasks } from 'mechanics/gameTick/tasks';
import { StoreState } from 'store/types';
import { createInitialStore } from 'store/reducers';
import getHarvest from 'mechanics/gameTick/harvest';
import { convertIntToSemVer } from 'utils/version';
import { loadGame } from 'store/actions/game';
import LoadingSpinner from 'components/ui/loading/LoadingSpinner';
import { PersistGate } from 'redux-persist/integration/react';
import App from 'components/App';

const TICK_INTERVAL = 2500; // main game tick

type GameActionsContextProps = {
  pauseGame: () => void,
  continueGame: () => void,
  restartGame: () => void,
};

const emptyFn = () => undefined;

export const GameActionsContext = createContext<GameActionsContextProps>({
  // values will all be overwritten in Game
  pauseGame: emptyFn,
  continueGame: emptyFn,
  restartGame: emptyFn,
});

const Game = () => {

  const paused = useRef(false);
  const [store, setStore] = useState<Store<StoreState & PersistPartial, AnyAction>>();
  const [persistor, setPersistor] = useState<Persistor>();


  /**
   * Gets called when a player starts a new game
   * @param store
   */
  const startNewGame = useCallback(() => {
    store?.dispatch(startGame());
    store?.dispatch(addLogText('test-game-welcome'));
    store?.dispatch(addLogText('test-you-have-found-an-item', { item: { type: 'weapon/battleAxe', quantity: 2  } }));
    // todo: here is a good place to launch a tutorial or something

    console.log(`Starting new GAME (version ${Version.default})`);
  }, [store]);

  /**
   * Attemps to read persisted store state. Sets `store` state when done */
  const setupStore = useCallback(async (initial: DeepPartial<StoreState> = {}) => {
    const configuration = await configureStore(initial);

    if (!configuration.isHydrated) {
      startNewGame();
    }
    setStore(configuration.store);
    setPersistor(configuration.persistor);
  }, [startNewGame]);

  /**
   * Puts loads the game with a fresh empty store
   */
  const restartGame = useCallback(() => {
    if (window.confirm('Are you sure you wish to reset all your progress?')){
      const newState = createInitialStore();
      store?.dispatch(loadGame(newState));
      startNewGame();
    }
  }, [startNewGame, store]);

  /**
   * Whenever store changes
   * Will kick off the main game loop.  */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!store) return;
    try {
      const gameVersion = store.getState().game?.version;
      if (gameVersion < Version.asInt && store.getState().game?.ignoreVersionDiff !== Version.asInt) {
        if (!window.confirm(`This game was initialized with version ${convertIntToSemVer(gameVersion)} which is older than the current client (${Version.default}). This might cause problems. Continue anyway? \n\n(pressing cancel will reset progress) `)) {
          restartGame();
          return;
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
    } catch (e) {
      console.log(e);
    }
    return () => {
      clearInterval(interval);
    };
  }, [restartGame, store]);

  const pauseGame = useCallback(() => {
    paused.current = true;
  }, []);

  const continueGame = useCallback(() => {
    paused.current = false;
  }, []);


  useEffect(() => {
    if (!store) {
      // Initial bootup
      setupStore();
    }
  }, [setupStore, store]);

  if (!store || !persistor) {
    return <LoadingSpinner />;
  }
  return (
    <GameActionsContext.Provider value={{
      pauseGame,
      continueGame,
      restartGame,
    }}>

      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </StoreProvider>
    </GameActionsContext.Provider>
  );
};

export default Game;
