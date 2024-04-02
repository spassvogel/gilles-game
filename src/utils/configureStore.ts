import { type Store } from 'redux'
import {
  type Persistor,
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import localForage from 'localforage'
import version, * as Version from 'constants/version'
import rootReducer from 'store/reducers'
import { storeIsRehydrated } from 'store/helpers/storeHelpers'
import { effectsMiddleware } from 'store/middleware/effects'
import { traitsMiddleware } from 'store/middleware/traits'
import { type Action } from 'store/actions'
import { gameTickMiddleware } from 'store/middleware/gameTick'
import { type DevToolsEnhancerOptions, configureStore, type Middleware } from '@reduxjs/toolkit'
import { type StoreState } from 'store/types'
import { STORAGE_KEY_PERSIST } from 'constants/storage'

export const persistConfig = {
  key: STORAGE_KEY_PERSIST,
  storage: localForage,
  version: Version.asInt
}

const persistedReducer = persistReducer<StoreState, Action>(persistConfig, rootReducer)

type ConfigureStoreResult = {
  store: Store<StoreState, Action>
  persistor: Persistor
  isHydrated: boolean
}

/**
 * Configures the redux store
 */

let devTools: DevToolsEnhancerOptions | false = false
if (process.env.NODE_ENV === 'development') {
  devTools = {
    name: `Gilles game ${version}`,
    actionsDenylist: 'gameTick'
  }
}

const store = configureStore({
  reducer: persistedReducer,
  devTools,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    }).concat(
      gameTickMiddleware as Middleware<Action, StoreState>,
      effectsMiddleware as Middleware<Action, StoreState>,
      traitsMiddleware as Middleware<Action, StoreState>
    )
  )
})

const configureStoreAndPersistor = async (): Promise<ConfigureStoreResult> => {
  return await new Promise((resolve, reject) => {
    try {
      // @ts-expect-error TS2590
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

export default configureStoreAndPersistor
