import { useCallback, useEffect, useRef, useState } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Store, AnyAction, DeepPartial } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { gameTick, ignoreVersionDiff, startGame } from 'store/actions/game';
import { addLogText } from 'store/actions/log';
import * as Version from 'constants/version';
import configureStore from 'utils/configureStore';
import { processCompletedTasks } from 'mechanics/gameTick/tasks';
import { StoreState } from 'store/types';
import { createInitialStore } from 'store/reducers';
import { convertIntToSemVer } from 'utils/version';
import { loadGame } from 'store/actions/game';
import { PersistGate } from 'redux-persist/integration/react';
import App from 'components/App';
import { GameActionsContext } from './context';
import LoadingPage from 'components/ui/loading/LoadingPage';
import ManifestLoader from 'components/loading/ManifestLoader';
import { TextManager } from 'global/TextManager';

const TICK_INTERVAL = 2500; // main game tick


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
   * Puts loads the game with a fresh empty store */
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
        store.dispatch(gameTick(delta));
    
        processCompletedTasks(state.tasks, store.dispatch);
      };

      interval = setInterval(gameLoop, TICK_INTERVAL);
    } catch (e) {
      console.warn(e);
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
    return (
      <LoadingPage>
        {TextManager.get('ui-game-loading-data')}
      </LoadingPage>
    );
  }
  return (
    <GameActionsContext.Provider value={{
      pauseGame,
      continueGame,
      restartGame,
    }}>

      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ManifestLoader>
            <App />
          </ManifestLoader>
        </PersistGate>
      </StoreProvider>
    </GameActionsContext.Provider>
  );
};

export default Game;

