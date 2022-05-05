import { createStore, DeepPartial, applyMiddleware, Middleware, Store } from 'redux';
import { Persistor, persistReducer, persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import localForage from 'localforage';
import * as Version from 'constants/version';
import rootReducer from 'store/reducers';
import { storeIsRehydrated } from 'store/helpers/storeHelpers';
import { StoreState } from 'store/types';
import { effectsMiddleware } from 'store/middleware/effects';
import { traitsMiddleware } from 'store/middleware/traits';
import { convertIntToSemVer } from './version';
import { Action } from 'store/actions';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { gameTickMiddleware } from 'store/middleware/gameTick';

export const PERSIST_KEY = 'root';

export const persistConfig = {
  key: PERSIST_KEY,
  storage: localForage,
  version: Version.asInt,
};

const persistedReducer = persistReducer<StoreState, Action>(persistConfig, rootReducer);

interface ConfigureStoreResult {
  store: Store;
  persistor: Persistor;
  isHydrated: boolean;
}

// all middlewares
const middlewares: Middleware[] = [
  gameTickMiddleware,
  effectsMiddleware,
  traitsMiddleware,
];
const middlewareEnhancer = applyMiddleware(...middlewares);

/**
 * Configures the redux store
 */
const configureStore = async (initial: DeepPartial<StoreState> = {}): Promise<ConfigureStoreResult> => {
  return new Promise((resolve, reject) => {
    try {
      const version = initial?.game?.version ? convertIntToSemVer(initial.game.version) : Version.default;
      const composeEnhancers = composeWithDevTools({
        name: `Gidletown (${version})`,
      })(middlewareEnhancer);

      const store = createStore(
        persistedReducer,
        (initial as StoreState & PersistPartial),
        composeEnhancers,
      );
      const persistor = persistStore(store, undefined, () => {
        const isHydrated = storeIsRehydrated(store.getState());
        resolve({ store, persistor, isHydrated }) ;
      });
    } catch (e) {
      console.error('An error has occurred', e);
      reject(e);
    }
  });
};

export default configureStore;
