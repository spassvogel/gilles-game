import { useCallback, useEffect, useRef, useState } from 'react'
import { Provider as StoreProvider } from 'react-redux'
import { type Store } from 'redux'
import { type Persistor } from 'redux-persist'
import { gameTick, ignoreVersionDiff, startGame, loadGame } from 'store/actions/game'
import { addLogText } from 'store/actions/log'
import * as Version from 'constants/version'
import createStore from 'utils/configureStore'
import { processCompletedTasks } from 'mechanics/gameTick/tasks'
import { type StoreState } from 'store/types'
import { createInitialStore } from 'store/reducers'
import { convertIntToSemVer } from 'utils/version'
import { PersistGate } from 'redux-persist/integration/react'
import App from 'components/App'
import { GameActionsContext } from './context'
import LoadingPage from 'components/ui/loading/LoadingPage'
import * as TextManager from 'global/TextManager'
import AssetLoader from 'components/loading/AssetLoader'
import { type Action } from 'store/actions'

const TICK_INTERVAL = 2500 // main game tick

const Game = () => {
  const paused = useRef(false)
  const [store, setStore] = useState<Store<StoreState, Action>>()
  const [persistor, setPersistor] = useState<Persistor>()

  /**
   * Gets called when a player starts a new game
   * @param store
   */
  const startNewGame = useCallback(() => {
    store?.dispatch(startGame())
    store?.dispatch(addLogText('test-game-welcome'))
    // todo: here is a good place to launch a tutorial or something

    console.log(`Starting new GAME (version ${Version.default})`)
  }, [store])

  /**
   * Attemps to read persisted store state. Sets `store` state when done */
  const setupStore = useCallback(async () => {
    const { isHydrated, store, persistor } = await createStore()

    if (!isHydrated) {
      startNewGame()
    }
    setStore(store)
    setPersistor(persistor)
  }, [startNewGame])

  /**
   * Puts loads the game with a fresh empty store */
  const restartGame = useCallback(() => {
    if (window.confirm('Are you sure you wish to reset all your progress?')) {
      const newState = createInitialStore()
      store?.dispatch(loadGame(newState))
      startNewGame()
    }
  }, [startNewGame, store])

  /**
   * Whenever store changes
   * Will kick off the main game loop.  */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (store == null) return
    try {
      const gameVersion = store.getState().game?.version
      if (gameVersion < Version.asInt && store.getState().game?.ignoreVersionDiff !== Version.asInt) {
        if (!window.confirm(`This game was initialized with version ${convertIntToSemVer(gameVersion)} which is older than the current client (${Version.default}). This might cause problems. Continue anyway? \n\n(pressing cancel will reset progress) `)) {
          restartGame()
          return
        }
        store.dispatch(ignoreVersionDiff())
      }

      const gameLoop = () => {
        if (paused.current) return

        const state: StoreState = store.getState()
        const delta = Date.now() - state.engine.lastTick
        store.dispatch(gameTick(delta))

        processCompletedTasks(state.tasks, store.dispatch)
      }

      interval = setInterval(gameLoop, TICK_INTERVAL)
    } catch (e) {
      console.warn(e)
    }
    return () => {
      clearInterval(interval)
    }
  }, [restartGame, store])

  const pauseGame = useCallback(() => {
    paused.current = true
  }, [])

  const continueGame = useCallback(() => {
    paused.current = false
  }, [])

  useEffect(() => {
    if (store === undefined) {
      // Initial bootup
      void setupStore()
    }
  }, [setupStore, store])

  if ((store === undefined) || (persistor === undefined)) {
    return (
      <LoadingPage>
        {TextManager.get('ui-game-loading-data')}
      </LoadingPage>
    )
  }

  return (
    <GameActionsContext.Provider value={{
      pauseGame,
      continueGame,
      restartGame
    }}>

      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AssetLoader>
            <App />
          </AssetLoader>
        </PersistGate>
      </StoreProvider>
    </GameActionsContext.Provider>
  )
}

export default Game
