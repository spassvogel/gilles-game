import { createStore, type DeepPartial, applyMiddleware, type Middleware, type Store } from 'redux'
import { type Persistor, persistReducer, persistStore } from 'redux-persist'
import { composeWithDevTools } from '@redux-devtools/extension'
import localForage from 'localforage'
import * as Version from 'constants/version'
import rootReducer from 'store/reducers'
import { storeIsRehydrated } from 'store/helpers/storeHelpers'
import { type StoreState } from 'store/types'
import { effectsMiddleware } from 'store/middleware/effects'
import { traitsMiddleware } from 'store/middleware/traits'
import { convertIntToSemVer } from './version'
import { type Action } from 'store/actions'
import { type PersistPartial } from 'redux-persist/es/persistReducer'
import { gameTickMiddleware } from 'store/middleware/gameTick'

export const PERSIST_KEY = 'root'

export const persistConfig = {
  key: PERSIST_KEY,
  storage: localForage,
  version: Version.asInt
}

const persistedReducer = persistReducer<StoreState, Action>(persistConfig, rootReducer)

type ConfigureStoreResult = {
  store: Store
  persistor: Persistor
  isHydrated: boolean
}

// all middlewares
const middlewares: Middleware[] = [
  gameTickMiddleware,
  effectsMiddleware,
  traitsMiddleware
]
const middlewareEnhancer = applyMiddleware(...middlewares)

/**
 * Configures the redux store
 */
const configureStore = async (initial: DeepPartial<StoreState> = {}): Promise<ConfigureStoreResult> => {
  return await new Promise((resolve, reject) => {
    try {
      const version = initial?.game?.version !== undefined ? convertIntToSemVer(initial.game.version) : Version.default
      const composeEnhancers = composeWithDevTools({
        name: `Gidletown (${version})`,
        actionsDenylist: ['gameTick']
      })(middlewareEnhancer)

      const store = createStore(
        persistedReducer,
        (initial as StoreState & PersistPartial),
        composeEnhancers
      )
      const persistor = persistStore(store, undefined, () => {
        const isHydrated = storeIsRehydrated(store.getState())
        resolve({ store, persistor, isHydrated })
      })
    } catch (e) {
      console.error('An error has occurred', e)
      reject(e)
    }
  })
}

export default configureStore
