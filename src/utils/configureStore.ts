import { createStore, compose, DeepPartial, applyMiddleware, Middleware, AnyAction, Store } from "redux";
import { Persistor, persistReducer, persistStore } from "redux-persist";
import localForage from 'localforage';
import rootReducer from "store/reducers/index";
import { asInt } from "constants/version";
import { storeIsRehydrated } from 'store/helpers/storeHelpers';
import { StoreState } from 'store/types';
import { effectsMiddleware } from "store/middleware/effects";
import { traitsMiddleware } from "store/middleware/traits";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export const PERSIST_KEY = "root";

export const persistConfig = {
  key: PERSIST_KEY,
  storage: localForage,
  version: asInt,
};

const persistedReducer = persistReducer<StoreState, AnyAction>(persistConfig, rootReducer);

interface ConfigureStoreResult {
  store: Store;
  persistor: Persistor;
  isHydrated: boolean;
}

// all middlewares
const middlewares: Middleware[] = [
  effectsMiddleware,
  traitsMiddleware
]
const middlewareEnhancer = applyMiddleware(...middlewares)
const composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)(middlewareEnhancer)

/**
 * Configures the redux store
 */
const configureStore = async (initial: DeepPartial<StoreState> = {}): Promise<ConfigureStoreResult> => {

  return new Promise((resolve, _reject) => {
    const store = createStore(
      persistedReducer,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      initial,
      composeEnhancers,
    );
    const persistor = persistStore(store, undefined, () => {
      const isHydrated = storeIsRehydrated(store.getState());
      resolve({ store, persistor, isHydrated }) ;
    });
  });
};

export default configureStore;
