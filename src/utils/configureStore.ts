import { createStore, DeepPartial, AnyAction, Store } from "redux";
import { Persistor, persistReducer, persistStore } from "redux-persist";
import localForage from 'localforage';
import rootReducer from "store/reducers/index";
import { asInt } from "constants/version";
import { storeIsRehydrated } from 'store/helpers/storeHelpers';
import { StoreState } from 'store/types';

const persistConfig = {
  key: "root",
  storage: localForage,
  version: asInt,
};

const persistedReducer = persistReducer<StoreState, AnyAction>(persistConfig, rootReducer);

interface ConfigureStoreResult {
  store: Store;
  persistor: Persistor;
  isHydrated: boolean;
}

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    );
    const persistor = persistStore(store, undefined, () => {
      console.log('persisted')
      const isHydrated = storeIsRehydrated(store.getState());
      resolve({ store, persistor, isHydrated }) ;
    });
  });
};

export default configureStore;
